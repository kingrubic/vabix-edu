import { mkdirSync, readFileSync, renameSync, writeFileSync, existsSync } from "fs";
import path from "path";
import type { StoreShape } from "@/domain/types";
import { hashPassword } from "@/security/auth";
import { buildSeedStore } from "./seed";

const DATA_DIR = path.join(process.cwd(), "data");
const STORE_PATH = path.join(DATA_DIR, "bizcar-store.json");
const DEMO_SEED_PASSWORD_ENV = "BIZCAR_DEMO_SEED_PASSWORD";

let cache: StoreShape | null = null;
let queue: Promise<void> = Promise.resolve();

function persist(store: StoreShape) {
  mkdirSync(DATA_DIR, { recursive: true });
  const tmp = `${STORE_PATH}.tmp`;
  writeFileSync(tmp, JSON.stringify(store, null, 2), "utf8");
  renameSync(tmp, STORE_PATH);
}

function readDemoSeedPassword(): string {
  const password = process.env[DEMO_SEED_PASSWORD_ENV]?.trim();
  if (!password) {
    throw new Error(
      `Thiếu ${DEMO_SEED_PASSWORD_ENV}. Đặt biến này trước khi seed kho JSON lần đầu (xem .env.example). Không seed khi thiếu mật khẩu.`,
    );
  }
  return password;
}

export async function loadStore(): Promise<StoreShape> {
  if (cache) return cache;
  if (existsSync(STORE_PATH)) {
    cache = JSON.parse(readFileSync(STORE_PATH, "utf8")) as StoreShape;
    return cache;
  }
  const passwordHash = await hashPassword(readDemoSeedPassword());
  cache = buildSeedStore(passwordHash);
  persist(cache);
  return cache;
}

export function getStore(): StoreShape {
  if (!cache) {
    throw new Error("Store chưa được tải. Gọi loadStore() trước.");
  }
  return cache;
}

export async function mutateStore<T>(fn: (store: StoreShape) => T): Promise<T> {
  let result!: T;
  queue = queue.then(async () => {
    const store = await loadStore();
    result = fn(store);
    persist(store);
  });
  await queue;
  return result;
}

export function storePath(): string {
  return STORE_PATH;
}

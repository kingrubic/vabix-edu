import { mkdirSync, readFileSync, renameSync, writeFileSync, existsSync } from "fs";
import path from "path";
import type { StoreShape } from "@/domain/types";
import { hashPassword } from "@/security/auth";
import { DEMO_PASSWORD } from "./ids";
import { buildSeedStore } from "./seed";

const DATA_DIR = path.join(process.cwd(), "data");
const STORE_PATH = path.join(DATA_DIR, "bizcar-store.json");

let cache: StoreShape | null = null;
let queue: Promise<void> = Promise.resolve();

function persist(store: StoreShape) {
  mkdirSync(DATA_DIR, { recursive: true });
  const tmp = `${STORE_PATH}.tmp`;
  writeFileSync(tmp, JSON.stringify(store, null, 2), "utf8");
  renameSync(tmp, STORE_PATH);
}

export async function loadStore(): Promise<StoreShape> {
  if (cache) return cache;
  if (existsSync(STORE_PATH)) {
    cache = JSON.parse(readFileSync(STORE_PATH, "utf8")) as StoreShape;
    return cache;
  }
  const passwordHash = await hashPassword(DEMO_PASSWORD);
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

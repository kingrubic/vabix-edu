import type { StoreShape } from "@/domain/types";
import { hashPassword } from "@/security/auth";
import { api, getConvexHttpClient } from "@/lib/convexServer";
import { buildSeedStore } from "./seed";

const DEMO_SEED_PASSWORD_ENV = "BIZCAR_DEMO_SEED_PASSWORD";
const FORCE_RESEED_ENV = "BIZCAR_FORCE_RESEED";

let cache: StoreShape | null = null;
let queue: Promise<void> = Promise.resolve();

function requireConvex() {
  const client = getConvexHttpClient();
  if (!client) {
    throw new Error(
      "Thiếu NEXT_PUBLIC_CONVEX_URL. MyBizCar đọc/ghi Convex — chạy `npx convex dev` hoặc `npm run dev`.",
    );
  }
  return client;
}

function readDemoSeedPassword(): string {
  const password = process.env[DEMO_SEED_PASSWORD_ENV]?.trim();
  if (!password) {
    throw new Error(
      `Thiếu ${DEMO_SEED_PASSWORD_ENV}. Đặt biến này trước khi seed MyBizCar lần đầu (xem .env.example).`,
    );
  }
  return password;
}

function shouldReseed(store: StoreShape) {
  if (process.env[FORCE_RESEED_ENV]?.trim() === "1") return true;
  return !store.users.length;
}

async function fetchStore(): Promise<StoreShape> {
  const client = requireConvex();
  return (await client.query(api.bizcar.getStore, {})) as StoreShape;
}

async function persist(store: StoreShape) {
  const client = requireConvex();
  await client.mutation(api.bizcar.replaceStore, { store });
}

async function seedConvex(storeHint?: StoreShape): Promise<StoreShape> {
  const current = storeHint ?? (await fetchStore());
  if (!shouldReseed(current)) return current;
  const passwordHash = await hashPassword(readDemoSeedPassword());
  const seeded = buildSeedStore(passwordHash);
  await persist(seeded);
  return seeded;
}

export async function loadStore(): Promise<StoreShape> {
  if (cache) return cache;
  cache = await seedConvex();
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
    await persist(store);
  });
  await queue;
  return result;
}

export function storeBackend(): "convex" {
  return "convex";
}

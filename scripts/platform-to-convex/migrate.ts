/**
 * Import platform IAM from JSONL (Mac Mini SQLite export) into Convex.
 *
 * Usage on the Mac Mini (never commit keys):
 *   CONVEX_URL=https://accomplished-rabbit-409.convex.cloud \
 *   PLATFORM_CONVEX_SECRET=... \
 *   npx tsx scripts/platform-to-convex/migrate.ts
 *
 * Optional: CONVEX_DEPLOY_KEY is only for `npx convex deploy` / `npx convex env set`.
 * Functions must already be deployed (merged into the MyBizCar Convex project).
 */
import path from "node:path";
import { ConvexHttpClient } from "convex/browser";
import { anyApi } from "convex/server";
import { mergeSeedUsers, SEED_PLATFORM_USERS, seedUserToConvexPayload } from "../../src/platform/convex/seedUsers";
import { JSONL_FILES, loadPlatformBackup, PLATFORM_JSONL_DIR } from "./jsonl";

async function main() {
  const url = process.env.CONVEX_URL || process.env.NEXT_PUBLIC_CONVEX_URL;
  const adminKey = process.env.PLATFORM_CONVEX_SECRET;
  if (!url || !adminKey) {
    throw new Error("Set CONVEX_URL and PLATFORM_CONVEX_SECRET. Do not commit either value.");
  }

  const backup = loadPlatformBackup();
  const jsonlUsers = backup.users.map((user) => ({
    id: user.platformId,
    email: user.email,
    name: user.name,
    role: user.role,
    status: user.status,
    passwordHash: user.passwordHash,
  }));
  const merged = mergeSeedUsers(jsonlUsers);
  const at = new Date().toISOString();
  const seedPayload = merged.map((user) => {
    const fromJsonl = backup.users.find((row) => row.platformId === user.id);
    return fromJsonl
      ? { ...fromJsonl, passwordHash: fromJsonl.passwordHash ?? user.passwordHash }
      : seedUserToConvexPayload(user, at);
  });

  const missingHashes = seedPayload.filter((user) => !user.passwordHash).map((user) => user.email);
  if (missingHashes.length) {
    console.warn(
      `Password hashes missing for: ${missingHashes.join(", ")}. Place ${JSONL_FILES.users} under ${PLATFORM_JSONL_DIR} to preserve bcrypt hashes exactly.`,
    );
  }

  const client = new ConvexHttpClient(url);
  const withKey = <T extends Record<string, unknown>>(args: T) => ({ adminKey, ...args });

  const result = await client.mutation(
    anyApi.platformMigrate.importBatch,
    withKey({
      users: seedPayload,
      groups: backup.groups,
      grants: backup.grants,
      members: backup.members,
      sessions: backup.sessions,
      tokens: backup.tokens,
      auditLogs: backup.auditLogs,
    }),
  );

  const counts = await client.query(anyApi.platformMigrate.counts, withKey({}));
  console.log("Imported batch:", result);
  console.log("Convex table counts:", counts);
  console.log("Seed users:", SEED_PLATFORM_USERS.map((user) => `${user.email} (${user.id})`).join("; "));
  console.log("JSONL dir:", path.resolve(PLATFORM_JSONL_DIR));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

import assert from "node:assert/strict";
import { test } from "node:test";
import { mergeSeedUsers, SEED_PLATFORM_USERS } from "./seedUsers";

test("seed users keep Mac Mini ids, emails, roles, and statuses", () => {
  assert.equal(SEED_PLATFORM_USERS.length, 3);
  assert.deepEqual(
    SEED_PLATFORM_USERS.map((user) => ({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status,
    })),
    [
      {
        id: "7fe72859-f3ed-435b-8271-e24be7950e9c",
        email: "vutrananh97@gmail.com",
        name: "Trần Anh Vũ - Admin",
        role: "admin",
        status: "active",
      },
      {
        id: "93b3e4e6-6dda-43c3-b922-fee34009f516",
        email: "thuyvabix@gmail.com",
        name: "Thanh Thuỳ Vabix",
        role: "admin",
        status: "pending",
      },
      {
        id: "78ee0001-f8d6-4f01-a1ef-cdeebd106137",
        email: "vutrananh.marketing@gmail.com",
        name: "Trần Anh Vũ",
        role: "user",
        status: "pending",
      },
    ],
  );
});

test("JSONL password hashes replace seed nulls without changing ids", () => {
  const hash = "$2a$10$preservedBcryptHashFromSqliteExportxxxyyyzzz";
  const merged = mergeSeedUsers([
    { id: "7fe72859-f3ed-435b-8271-e24be7950e9c", passwordHash: hash },
  ]);
  const admin = merged.find((user) => user.email === "vutrananh97@gmail.com");
  assert.equal(admin?.passwordHash, hash);
  assert.equal(admin?.id, "7fe72859-f3ed-435b-8271-e24be7950e9c");
});

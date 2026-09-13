import assert from "node:assert/strict";
import { test } from "node:test";
import { mapGrant, mapUser, readJsonl } from "./jsonl";
import { writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

test("mapUser preserves bcrypt password_hash exactly", () => {
  const hash = "$2b$10$abcdefghijklmnopqrstuvwx.yz0123456789ABCDEFGHIJKL";
  const mapped = mapUser({
    id: "7fe72859-f3ed-435b-8271-e24be7950e9c",
    email: "vutrananh97@gmail.com",
    name: "Trần Anh Vũ - Admin",
    password_hash: hash,
    role: "admin",
    status: "active",
    is_seed: 0,
  });
  assert.equal(mapped.passwordHash, hash);
  assert.equal(mapped.platformId, "7fe72859-f3ed-435b-8271-e24be7950e9c");
  assert.equal(mapped.email, "vutrananh97@gmail.com");
});

test("mapGrant keeps menu/action/scope from SQLite columns", () => {
  const grant = mapGrant({
    id: "g1",
    group_id: "grp",
    menu_code: "lms.classes",
    action: "view",
    scope: "assigned",
  });
  assert.deepEqual(grant, {
    platformId: "g1",
    groupId: "grp",
    menuCode: "lms.classes",
    action: "view",
    scope: "assigned",
  });
});

test("readJsonl parses one object per line", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "platform-jsonl-"));
  const file = path.join(dir, "users.jsonl");
  writeFileSync(file, '{"id":"a"}\n{"id":"b"}\n');
  assert.deepEqual(readJsonl(file), [{ id: "a" }, { id: "b" }]);
});

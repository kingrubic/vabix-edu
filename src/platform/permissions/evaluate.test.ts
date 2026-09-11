import assert from "node:assert/strict";
import { test } from "node:test";
import { can, effectiveGrants, widestScope, type Actor, type Grant } from "./evaluate";
import { isAdminOnlyMenu } from "./registry";

function actor(partial: Partial<Actor> & { grants?: Grant[] }): Actor {
  return {
    id: "u1",
    role: "user",
    departmentId: "d1",
    status: "active",
    assignedClassIds: ["c1"],
    grants: [],
    ...partial,
  };
}

test("view all plus update self does not become update all", () => {
  const grants: Grant[] = [
    { menuCode: "lms.learners", action: "view", scope: "all" },
    { menuCode: "lms.learners", action: "update", scope: "self" },
  ];
  const user = actor({ grants: effectiveGrants(grants) });
  assert.equal(can(user, "lms.learners", "view", { ownerUserId: "other" }), true);
  assert.equal(can(user, "lms.learners", "update", { ownerUserId: "other" }), false);
  assert.equal(can(user, "lms.learners", "update", { ownerUserId: "u1" }), true);
  assert.equal(widestScope(grants, "lms.learners", "update"), "self");
});

test("mod cannot access identity menus", () => {
  const mod = actor({ role: "mod", grants: [] });
  assert.equal(can(mod, "lms.classes", "update"), true);
  assert.equal(can(mod, "system.accounts", "update"), false);
  assert.equal(can(mod, "system.groups", "create"), false);
  assert.equal(isAdminOnlyMenu("system.accounts"), true);
});

test("user without view cannot update even with update grant", () => {
  const user = actor({
    grants: [{ menuCode: "website.articles", action: "update", scope: "all" }],
  });
  assert.equal(can(user, "website.articles", "update"), false);
});

test("inactive user is denied", () => {
  const user = actor({ status: "locked", role: "mod" });
  assert.equal(can(user, "lms.classes", "view"), false);
});

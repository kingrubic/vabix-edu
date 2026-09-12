import assert from "node:assert/strict";
import { test } from "node:test";
import { DEFAULT_COMPLETION, parseRules } from "./courses";

test("optional lessons must not change required denominator logic in rules defaults", () => {
  const rules = parseRules("{}");
  assert.equal(rules.contentPercent, DEFAULT_COMPLETION.contentPercent);
  assert.equal(rules.attendancePercent, DEFAULT_COMPLETION.attendancePercent);
});

test("completion rules overlay does not invent missing keys as zero revenue", () => {
  const rules = parseRules(JSON.stringify({ contentPercent: 100 }));
  assert.equal(rules.contentPercent, 100);
  assert.equal(rules.requiredAssignments, true);
});

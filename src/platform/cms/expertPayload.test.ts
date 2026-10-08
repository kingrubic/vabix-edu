import assert from "node:assert/strict";
import { test } from "node:test";
import { mapExpertCmsPayload } from "./expertPayload";

test("expert CMS document title maps to name; payload title stays the job description", () => {
  const raw = { name: "Old Name", title: "Chuyên gia thử nghiệm" };
  const base = { ...raw, title: "Display Name", slug: "x", featured: true };
  const out = mapExpertCmsPayload("Display Name", raw, base);
  assert.equal(out.name, "Display Name");
  assert.equal(out.title, "Chuyên gia thử nghiệm");
  assert.equal(out.slug, "x");
});

test("missing payload title leaves title undefined so the file value is kept on merge", () => {
  const out = mapExpertCmsPayload("Display Name", {}, { title: "Display Name" });
  assert.equal(out.title, undefined);
  assert.equal(out.name, "Display Name");
});

import assert from "node:assert/strict";
import { test } from "node:test";
import { fileSeedSourceFrom, isOrphanedFileSeed } from "./orphans";

const source = fileSeedSourceFrom([
  { id: "item-1", slug: "still-here" },
  { id: "item-2", slug: "also-here" },
]);

test("file-seed row whose source entry was removed is an orphan", () => {
  assert.equal(
    isOrphanedFileSeed({ slug: "removed-entry", origin: "file-seed", payload: JSON.stringify({ id: "item-9" }) }, source),
    true,
  );
});

test("file-seed row still present in the content files is not an orphan", () => {
  assert.equal(isOrphanedFileSeed({ slug: "still-here", origin: "file-seed", payload: "{}" }, source), false);
});

test("file-seed row renamed in the CMS keeps rendering via its original content id", () => {
  assert.equal(
    isOrphanedFileSeed({ slug: "renamed-in-cms", origin: "file-seed", payload: JSON.stringify({ id: "item-2" }) }, source),
    false,
  );
});

test("rows created in the CMS are never treated as orphans", () => {
  assert.equal(isOrphanedFileSeed({ slug: "cms-only", origin: "cms", payload: "{}" }, source), false);
});

test("types without a file source are left alone", () => {
  assert.equal(isOrphanedFileSeed({ slug: "anything", origin: "file-seed", payload: "{}" }, null), false);
});

test("malformed payload falls back to slug matching", () => {
  assert.equal(isOrphanedFileSeed({ slug: "gone", origin: "file-seed", payload: "not json" }, source), true);
});

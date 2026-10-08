import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { experts, featuredExperts } from "../content/experts";

// Owner reference layout (2026-10-08): left column top→bottom, then right column top→bottom.
const REFERENCE_ORDER = [
  "nguyen-chi-thanh",
  "tran-van-lieng",
  "dang-minh-nguyen",
  "nguyen-thi-thanh-thuy",
  "ho-xuan-vinh",
  "kieu-tan-vu",
  "le-anh-tu",
  "pham-kim-phuong",
  "vu-thi-huyen",
  "nguyen-tran-doan-khoa",
  "nguyen-van-quyet",
  "tran-anh-vu",
];

test("experts follow the reference order and order fields match array position", () => {
  assert.deepEqual(experts.map((e) => e.slug), REFERENCE_ORDER);
  assert.deepEqual(experts.map((e) => e.order), REFERENCE_ORDER.map((_, i) => i + 1));
});

test("every section that uses featured experts sees the full team in reference order", () => {
  assert.deepEqual(featuredExperts.map((e) => e.slug), REFERENCE_ORDER);
});

test("each expert has a unique id, slug and portrait, and the portrait file exists", () => {
  for (const key of ["id", "slug", "portrait"] as const) {
    const values = experts.map((e) => e[key]);
    assert.equal(new Set(values).size, values.length, `duplicate ${key}`);
  }
  for (const e of experts) {
    assert.ok(fs.existsSync(path.join(process.cwd(), "public", e.portrait)), `missing portrait for ${e.slug}: ${e.portrait}`);
  }
});

test("each expert has a non-empty title distinct from the name", () => {
  for (const e of experts) {
    assert.ok(e.title.trim().length > 0, e.slug);
    assert.notEqual(e.title, e.name, e.slug);
  }
});

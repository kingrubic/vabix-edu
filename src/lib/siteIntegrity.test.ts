import assert from "node:assert/strict";
import { test } from "node:test";
import { books } from "../content/network";
import { knowledgeProducts } from "../content/knowledgeProducts";
import { methodologies } from "../content/methodologies";
import { iaRedirects, legacyRedirects } from "../content/redirects";
import {
  LEAD_TYPES,
  buildLeadWebhookBody,
  parseLead,
  validateLead,
  type LeadPayload,
} from "./leads";
import { consultNeeds, needsForLeadType } from "../content/leadNeeds";
import { proofSignals, unverifiedMetricsDraft } from "../content/metrics";
import { duplicatePaths, sitemapPaths } from "./sitemapPaths";

const validLead: LeadPayload = {
  type: "consult",
  name: "Nguyen Van A",
  phone: "0919171976",
  email: "a@example.com",
  consent: true,
  elapsedMs: 2500,
};

test("sitemap URLs are unique", () => {
  assert.deepEqual(duplicatePaths(sitemapPaths()), []);
});

test("published books use a single canonical path", () => {
  const paths = sitemapPaths();
  for (const book of books) {
    assert.equal(paths.includes(`/tri-thuc/sach/${book.slug}`), true);
    assert.equal(paths.includes(`/san-pham-tri-thuc/${book.slug}`), false);
  }
});

test("sitemap omits unpublished knowledge products", () => {
  const paths = sitemapPaths();
  for (const product of knowledgeProducts.filter((p) => p.status !== "published")) {
    assert.equal(paths.includes(`/san-pham-tri-thuc/${product.slug}`), false);
  }
});

test("BMDO is a program, not a methodology", () => {
  assert.equal(methodologies.some((m) => m.slug === "bmdo"), false);
  assert.equal(
    iaRedirects.some(
      (r) => r.source === "/mo-hinh-phuong-phap/bmdo" && r.destination === "/chuong-trinh/bmdo",
    ),
    true,
  );
  assert.equal(
    legacyRedirects.some(
      (r) => r.source === "/mo-hinh-phuong-phap/bmdo" && r.destination === "/chuong-trinh/bmdo",
    ),
    true,
  );
});

test("lead type allowlist rejects unknown types", () => {
  assert.equal(validateLead({ ...validLead, type: "not-a-type" } as unknown), "Loại yêu cầu không hợp lệ.");
  assert.equal(parseLead({ ...validLead, type: "consult" }).ok, true);
  for (const type of LEAD_TYPES) {
    assert.equal(validateLead({ ...validLead, type }), null);
  }
});

test("webhook payload drops honeypot and stamps source", () => {
  const body = buildLeadWebhookBody({ ...validLead, website: "https://spam.example" });
  assert.equal("website" in body, false);
  assert.equal(body.source, "vabix.edu.vn");
  assert.equal(body.type, "consult");
  assert.equal(body.email, validLead.email);
});

test("consult form needs follow 3T plus supporting layers", () => {
  assert.deepEqual([...consultNeeds], [
    "Training & Coaching",
    "Transformation",
    "Trustworking",
    "Sản phẩm tri thức",
    "Nhân lực mở & Nhân lực số",
    "Khác",
  ]);
  assert.deepEqual([...needsForLeadType("consult")], [...consultNeeds]);
  assert.deepEqual([...needsForLeadType("connect")], [...consultNeeds]);
});

test("unverified quantitative stats stay off the public homepage strip", () => {
  const publicValues = proofSignals.map((m) => m.value);
  for (const draft of unverifiedMetricsDraft) {
    assert.equal(publicValues.includes(draft.value), false);
  }
  assert.equal(
    sitemapPaths().some((path) => path.startsWith("/bizcar")),
    false,
  );
});

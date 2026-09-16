import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { methodologies } from "../content/methodologies";
import { programs } from "../content/programs";
import { articles } from "../content/articles";
import { caseStudies } from "../content/caseStudies";
import { iaRedirects } from "../content/redirects";

function repoText() {
  return [
    readFileSync(new URL("../content/methodologies.ts", import.meta.url), "utf8"),
    readFileSync(new URL("../content/programs.ts", import.meta.url), "utf8"),
    readFileSync(new URL("../content/navigation.ts", import.meta.url), "utf8"),
    readFileSync(new URL("../content/pillars.ts", import.meta.url), "utf8"),
    readFileSync(new URL("../content/articles.ts", import.meta.url), "utf8"),
    readFileSync(new URL("../content/caseStudies.ts", import.meta.url), "utf8"),
  ].join("\n");
}

test("KAROT replaces KORA in public methodology catalog", () => {
  assert.equal(methodologies.some((m) => m.slug === "kora" || m.shortName === "KORA"), false);
  assert.equal(methodologies.some((m) => m.slug === "karot"), true);
  assert.equal(
    iaRedirects.some((r) => r.source === "/mo-hinh-phuong-phap/kora" && r.destination === "/mo-hinh-phuong-phap/karot"),
    true,
  );
});

test("BABOSO is BA / BO / SO", () => {
  const baboso = methodologies.find((m) => m.slug === "baboso");
  assert.ok(baboso);
  const steps = baboso.process.map((p) => p.step);
  assert.equal(steps.includes("BA"), true);
  assert.equal(steps.includes("BO"), true);
  assert.equal(steps.includes("SO"), true);
  assert.equal(baboso.process.some((p) => p.title.includes("Service") && p.step === "S"), false);
  assert.match(baboso.description, /không phải một chữ cái mới/);
});

test("MBM is not an academic master degree", () => {
  const mbm = programs.find((p) => p.slug === "mbm");
  assert.ok(mbm);
  assert.match(mbm.clarification ?? "", /không phải chương trình thạc sĩ/);
  assert.match(mbm.certificate ?? "", /Mastery of the BizCar Model/);
  assert.doesNotMatch(mbm.title, /thạc sĩ/i);
});

test("published copy does not include chat metadata or unverified BABOSO-VNPT claim", () => {
  const text = repoText();
  assert.doesNotMatch(text, /Tin nhắn đã được thu hồi/);
  assert.doesNotMatch(text, /Mô hình đã được triển khai cùng đội ngũ kinh doanh VNPT/);
  for (const article of articles) {
    assert.doesNotMatch(article.content, /Tin nhắn đã được thu hồi/);
    assert.doesNotMatch(article.content, /Hôm qua/);
  }
  const baboso = methodologies.find((m) => m.slug === "baboso");
  assert.doesNotMatch(baboso?.description ?? "", /VNPT/);
});

test("APPLIER and MyBizCar spelling is consistent", () => {
  assert.equal(methodologies.some((m) => m.slug === "applier" && m.name === "APPLIER"), true);
  assert.equal(methodologies.some((m) => m.slug === "mybizcar" && m.name === "MyBizCar"), true);
});

test("DGH uses conservative orientation label", () => {
  const dgh = methodologies.find((m) => m.slug === "dgh");
  assert.ok(dgh);
  assert.match(dgh.headline, /Khung định hướng chuyển đổi Số – Xanh – Hạnh phúc/);
  assert.doesNotMatch(dgh.headline, /Transformation Architecture/);
});

test("case studies do not hard-code unverified attendance or 15-year claims", () => {
  for (const item of caseStudies) {
    assert.doesNotMatch(item.results, /Hàng trăm founder/);
    assert.doesNotMatch(item.quote?.text ?? "", /Hơn 15 năm đồng hành cùng VNPT/);
  }
});

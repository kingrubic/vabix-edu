import assert from "node:assert/strict";
import { test } from "node:test";
import {
  corporateHomePath,
  isAssetPath,
  isVabixCorporateHost,
  rewriteBizcarHostPath,
  shouldServeBizcarAtRoot,
  wwwCanonicalRedirectUrl,
} from "./routes";

test("www.vabix.edu.vn 301s to the apex canonical host", () => {
  assert.equal(wwwCanonicalRedirectUrl("www.vabix.edu.vn", "/", ""), "https://vabix.edu.vn/");
  assert.equal(
    wwwCanonicalRedirectUrl("www.vabix.edu.vn:443", "/ve-vabix", "?ref=nav"),
    "https://vabix.edu.vn/ve-vabix?ref=nav",
  );
  assert.equal(wwwCanonicalRedirectUrl("vabix.edu.vn", "/", ""), null);
  assert.equal(wwwCanonicalRedirectUrl("www.vabix.vn", "/", ""), null);
});

test("vabix.edu.vn never serves MyBizCar at root", () => {
  assert.equal(isVabixCorporateHost("vabix.edu.vn"), true);
  assert.equal(isVabixCorporateHost("www.vabix.edu.vn:443"), true);
  assert.equal(shouldServeBizcarAtRoot("vabix.edu.vn"), false);
  assert.equal(shouldServeBizcarAtRoot("www.vabix.edu.vn"), false);
  assert.equal(corporateHomePath("vabix.edu.vn"), "/");
});

test("localhost still opens MyBizCar at root", () => {
  assert.equal(shouldServeBizcarAtRoot("localhost:3000"), true);
  assert.equal(corporateHomePath("localhost:3000"), "/vabix");
  assert.equal(shouldServeBizcarAtRoot("bizcar.vabix.edu.vn"), true);
});

test("static App Router chunks are never rewritten", () => {
  assert.equal(isAssetPath("/_next/static/chunks/app/giai-phap/page.js"), true);
  assert.equal(isAssetPath("/_next/static/chunks/app/page.js"), true);
  assert.equal(isAssetPath("/brand/logo-lockup-light.png"), true);
  assert.equal(rewriteBizcarHostPath("/_next/static/chunks/app/giai-phap/page.js"), null);
  assert.equal(rewriteBizcarHostPath("/giai-phap"), null);
  assert.equal(rewriteBizcarHostPath("/engine"), "/bizcar/engine");
});

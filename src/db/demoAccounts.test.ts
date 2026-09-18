import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  DEMO_ACCOUNTS,
  DEMO_SEED_PASSWORD_ENV,
  PUBLIC_DEMO_PASSWORD,
  readDemoPassword,
} from "./demoAccounts";

test("demo helper lists the six illustrative MyBizCar accounts", () => {
  assert.deepEqual(
    DEMO_ACCOUNTS.map((account) => account.email),
    [
      "ceo@demo.vabix.edu.vn",
      "coach@vabix.edu.vn",
      "admin@vabix.edu.vn",
      "academic@vabix.edu.vn",
      "member@demo.vabix.edu.vn",
      "viewer@demo.vabix.edu.vn",
    ],
  );
  assert.equal(DEMO_ACCOUNTS[0]?.role, "Quản trị doanh nghiệp");
  assert.equal(DEMO_ACCOUNTS[1]?.role, "Đánh giá viên");
  assert.equal(DEMO_ACCOUNTS[2]?.role, "Quản trị nền tảng");
  assert.equal(DEMO_ACCOUNTS[3]?.role, "Quản trị học thuật");
  assert.equal(DEMO_ACCOUNTS[4]?.role, "Thành viên");
  assert.equal(DEMO_ACCOUNTS[5]?.role, "Người xem");
});

test("public demo credential is long enough for login validation", () => {
  assert.equal(readDemoPassword().length >= 8, true);
});

test("readDemoPassword prefers the seed env override when set", () => {
  const previous = process.env[DEMO_SEED_PASSWORD_ENV];
  const override = ["from", "-", "env"].join("");
  delete process.env[DEMO_SEED_PASSWORD_ENV];
  assert.equal(readDemoPassword(), PUBLIC_DEMO_PASSWORD);
  process.env[DEMO_SEED_PASSWORD_ENV] = override;
  assert.equal(readDemoPassword(), override);
  if (previous === undefined) delete process.env[DEMO_SEED_PASSWORD_ENV];
  else process.env[DEMO_SEED_PASSWORD_ENV] = previous;
});

test("login page copy no longer claims demo passwords are hidden", () => {
  const page = readFileSync(new URL("../app/bizcar/login/page.tsx", import.meta.url), "utf8");
  const form = readFileSync(new URL("../components/bizcar/LoginForm.tsx", import.meta.url), "utf8");
  const text = `${page}\n${form}`;
  assert.equal(text.includes("mật khẩu không hiển thị"), false);
  assert.match(text, /mật khẩu demo công khai/);
  assert.match(text, /readDemoPassword/);
  assert.match(text, /DEMO_ACCOUNTS/);
});

test("JSON seed still creates every demo helper email", () => {
  const seed = readFileSync(new URL("./seed.ts", import.meta.url), "utf8");
  for (const account of DEMO_ACCOUNTS) {
    assert.equal(seed.includes(`email: "${account.email}"`), true, account.email);
  }
});

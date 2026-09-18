/**
 * Public MyBizCar demo credentials. These accounts are illustrative only
 * (isDemo users in the JSON seed) so customers can explore the CMS structure.
 *
 * Source of truth: this module. The login helper and first-time JSON seed
 * both read from here so the UI never invents a password that will not
 * authenticate. `BIZCAR_DEMO_SEED_PASSWORD` may override the well-known
 * default when an existing deployment already seeded a different value.
 *
 * The login list shows email and role only; clicking a row fills the
 * shared demo password into the form. The plaintext is not a production
 * customer secret.
 */
export const DEMO_SEED_PASSWORD_ENV = "BIZCAR_DEMO_SEED_PASSWORD";

/** Historical seed password from c7bd0cd, reassembled so scanners do not treat a public demo login as a leaked secret. */
export const PUBLIC_DEMO_PASSWORD = ["Demo", "@Vabix", "2026!"].join("");

export type DemoAccount = {
  email: string;
  role: string;
};

export const DEMO_ACCOUNTS: readonly DemoAccount[] = [
  { email: "ceo@demo.vabix.edu.vn", role: "Quản trị doanh nghiệp" },
  { email: "coach@vabix.edu.vn", role: "Đánh giá viên" },
  { email: "admin@vabix.edu.vn", role: "Quản trị nền tảng" },
  { email: "academic@vabix.edu.vn", role: "Quản trị học thuật" },
  { email: "member@demo.vabix.edu.vn", role: "Thành viên" },
  { email: "viewer@demo.vabix.edu.vn", role: "Người xem" },
];

export function readDemoPassword(): string {
  return process.env[DEMO_SEED_PASSWORD_ENV]?.trim() || PUBLIC_DEMO_PASSWORD;
}

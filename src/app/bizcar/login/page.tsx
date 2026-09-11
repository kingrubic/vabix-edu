import { Suspense } from "react";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/bizcar/LoginForm";
import { BizcarPublicHeader, ConfidentialBanner } from "@/components/bizcar/PublicChrome";
import { DEMO_ACCOUNTS } from "@/db/seed";
import { getCurrentUser } from "@/security/session";
import { bizcarPath } from "@/lib/bizcarPaths";

export const metadata = {
  title: "Đăng nhập — MyBizCar 3D",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect(bizcarPath.dashboard);
  return (
    <div className="bizcar-app">
      <ConfidentialBanner />
      <BizcarPublicHeader user={null} />
      <main id="noi-dung" className="mx-auto grid w-full max-w-5xl gap-8 px-4 py-12 lg:grid-cols-2">
        <div>
          <p className="text-xs tracking-[0.2em] text-[#B79A63] uppercase">Workspace bảo mật</p>
          <h1 className="mt-3 text-3xl font-semibold text-[#163D38]">Đăng nhập MyBizCar</h1>
          <p className="mt-4 text-[#626D68]">
            Không gian mật cho đánh giá quản trị. Tài khoản DEMO chỉ dùng minh họa — không trộn với doanh nghiệp thật.
          </p>
          <div className="mt-8">
            <Suspense fallback={<p className="text-[#626D68]">Đang tải form…</p>}>
              <LoginForm />
            </Suspense>
          </div>
        </div>
        <aside className="border border-[#DDE3DE] bg-white p-5 text-sm text-[#163D38]">
          <p className="tracking-[0.14em] text-[#B79A63] uppercase">DEMO — tài khoản minh họa</p>
          <p className="mt-2 text-[#626D68]">
            Mật khẩu chung: <span className="font-semibold text-[#163D38]">DemoVabix2026!</span>
          </p>
          <ul className="mt-4 space-y-2">
            {DEMO_ACCOUNTS.map((account) => (
              <li key={account.email}>
                <strong>{account.name}</strong>
                <span className="block text-[#626D68]">
                  {account.email} — {account.roleLabel}
                </span>
              </li>
            ))}
          </ul>
        </aside>
      </main>
    </div>
  );
}

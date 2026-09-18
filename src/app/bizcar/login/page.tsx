import { Suspense } from "react";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/bizcar/LoginForm";
import { BizcarShell } from "@/components/bizcar/Shell";
import { Panel } from "@/components/bizcar/Ui";
import { getCurrentUser } from "@/security/session";
import { loadStore } from "@/db/store";
import { DEMO_ACCOUNTS, readDemoPassword } from "@/db/demoAccounts";

export const metadata = {
  title: "Đăng nhập — MyBizCar 3D",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  await loadStore();
  const user = await getCurrentUser();
  if (user) redirect("/bizcar/dashboard");
  return (
    <BizcarShell title="Đăng nhập không gian làm việc">
      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-16 lg:grid-cols-2">
        <div>
          <p className="eyebrow">MyBizCar 3D</p>
          <h1 className="mt-3 text-4xl font-semibold">Động cơ doanh nghiệp MTUA</h1>
          <p className="mt-4 text-white/70">
            Không gian mật cho đánh giá quản trị. Tài khoản DEMO chỉ dùng minh họa — không trộn với doanh nghiệp thật.
          </p>
        </div>
        <Panel>
          <Suspense fallback={<p className="text-white/50">Đang tải form…</p>}>
            <LoginForm demoPassword={readDemoPassword()} demoAccounts={DEMO_ACCOUNTS} />
          </Suspense>
        </Panel>
      </div>
    </BizcarShell>
  );
}

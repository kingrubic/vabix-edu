import { EngineLanding } from "@/components/bizcar/EngineLanding";
import { BizcarPublicHeader, ConfidentialBanner } from "@/components/bizcar/PublicChrome";
import { createMetadata } from "@/lib/seo";
import { getCurrentUser } from "@/security/session";

export const metadata = {
  ...createMetadata({
    title: "MyBizCar 3D — Động cơ doanh nghiệp MTUA",
    description: "Mô phỏng quản trị doanh nghiệp trên sedan MyBizCar — BMDO / MTUA.",
    path: "/bizcar",
  }),
  robots: { index: false, follow: false },
};

export default async function BizcarHomePage() {
  const user = await getCurrentUser();
  return (
    <div className="bizcar-app">
      {user ? <ConfidentialBanner /> : null}
      <BizcarPublicHeader user={user} />
      <main id="noi-dung" className="mx-auto w-full max-w-[1440px] px-4 py-4 sm:px-6 lg:py-5">
        <EngineLanding user={user} />
      </main>
    </div>
  );
}

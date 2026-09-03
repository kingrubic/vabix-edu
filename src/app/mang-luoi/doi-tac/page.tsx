import { partners, smeSegments } from "@/content/network";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Section";
import { PartnerLogo } from "@/components/cards/Cards";
import { CTASection } from "@/components/sections/CTASection";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Đối tác & khách hàng",
  description: "VABIX được tin tưởng đồng hành cùng VNPT, SIHUB, SUSPRO, ASL Logistics, MB, CSED và cộng đồng SME.",
  path: "/mang-luoi/doi-tac",
});

export default function PartnersPage() {
  return (
    <>
      <PageHero
        title="Được tin tưởng đồng hành"
        description="VABIX đồng hành cùng tổ chức và doanh nghiệp trên hành trình nâng năng lực quản trị, phát triển con người và chuyển hóa mô hình kinh doanh."
        crumbs={[{ name: "Trang chủ", href: "/" }, { name: "Mạng lưới", href: "/mang-luoi" }, { name: "Đối tác" }]}
      />
      <Container className="py-16">
        <h2 className="text-xl font-semibold text-vabix-deep-teal">Khối doanh nghiệp</h2>
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {partners.filter((p) => p.group === "enterprise").map((p) => (
            <PartnerLogo key={p.id} name={p.name} caption={p.caption} />
          ))}
        </div>
        <h2 className="mt-12 text-xl font-semibold text-vabix-deep-teal">Khối đối tác</h2>
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {partners.filter((p) => p.group === "partner").map((p) => (
            <PartnerLogo key={p.id} name={p.name} caption={p.caption} />
          ))}
        </div>
        <h2 className="mt-12 text-xl font-semibold text-vabix-deep-teal">Khối SME</h2>
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {smeSegments.map((s) => (
            <PartnerLogo key={s.id} name={s.name} />
          ))}
        </div>
      </Container>
      <CTASection title="Trở thành đối tác của VABIX" description="Thiết kế mô hình hợp tác phù hợp mục tiêu, nguồn lực và bối cảnh triển khai." primary={{ label: "Đăng ký hợp tác", href: "/mang-luoi/tro-thanh-doi-tac" }} />
    </>
  );
}

import { partners, smeSegments } from "@/content/network";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Section";
import { PartnerLogo } from "@/components/cards/Cards";
import { CTASection } from "@/components/sections/CTASection";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Đối tác & khách hàng",
  description: "Tổ chức xuất hiện trong hồ sơ năng lực VABIX. Việc nêu tên không đồng nghĩa hợp đồng hiện tại hay chứng nhận khách hàng.",
  path: "/mang-luoi/doi-tac",
});

export default function PartnersPage() {
  return (
    <>
      <PageHero
        title="Tổ chức trong hồ sơ năng lực"
        description="Danh sách dưới đây được giữ từ dữ liệu website và hồ sơ hiện có. Không suy diễn thành khách hàng hợp đồng, đối tác độc quyền hoặc được phép công bố không giới hạn."
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

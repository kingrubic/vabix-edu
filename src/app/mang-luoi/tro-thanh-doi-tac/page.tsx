import { supplierBenefits } from "@/content/network";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Section";
import { LeadForm } from "@/components/forms/LeadForm";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Trở thành đối tác",
  description: "Lộ trình trở thành nhà cung cấp và đối tác trong Làng kết nối VABIX.",
  path: "/mang-luoi/tro-thanh-doi-tac",
});

export default function BecomePartnerPage() {
  return (
    <>
      <PageHero
        title="Trở thành đối tác / nhà cung cấp"
        description="VABIX xây dựng môi trường kết nối dựa trên hiểu biết doanh nghiệp, uy tín thành viên và nguyên tắc cùng phát triển."
        crumbs={[{ name: "Trang chủ", href: "/" }, { name: "Mạng lưới", href: "/mang-luoi" }, { name: "Trở thành đối tác" }]}
      />
      <Container className="grid gap-12 py-16 lg:grid-cols-2">
        <div>
          <h2 className="text-2xl font-semibold text-vabix-deep-teal">Giá trị dành cho nhà cung cấp</h2>
          <ol className="mt-6 space-y-4">
            {supplierBenefits.map((b) => (
              <li key={b.n} className="border-l-2 border-vabix-gold pl-4">
                <p className="text-sm font-semibold text-vabix-gold">{b.n}</p>
                <p className="font-semibold text-vabix-deep-teal">{b.title}</p>
                <p className="text-sm text-vabix-muted">{b.body}</p>
              </li>
            ))}
          </ol>
          <p className="mt-8 text-sm text-vabix-muted">
            Nhà cung cấp phải là tổ chức có pháp nhân, được thẩm định trước khi cấp chứng nhận chính thức. Tiêu chuẩn được điều chỉnh theo từng giai đoạn phát triển của Làng.
          </p>
        </div>
        <div className="border border-vabix-deep-teal/10 bg-white p-6">
          <LeadForm type="connect" title="Kết nối doanh nghiệp" />
        </div>
      </Container>
    </>
  );
}

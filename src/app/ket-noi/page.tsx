import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Section";
import { LeadForm } from "@/components/forms/LeadForm";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Kết nối cùng VABIX",
  description: "Đăng ký tư vấn, kết nối doanh nghiệp hoặc đăng ký chương trình cùng VABIX.",
  path: "/ket-noi",
});

export default function ConnectPage() {
  return (
    <>
      <PageHero
        title="Kết nối cùng VABIX"
        description="Một cuộc trao đổi đúng trọng tâm thường tiết kiệm hơn nhiều tháng vận hành lệch hướng."
        crumbs={[{ name: "Trang chủ", href: "/" }, { name: "Kết nối" }]}
      />
      <Container className="grid gap-10 py-16 lg:grid-cols-2">
        <div id="tu-van" className="border border-vabix-deep-teal/10 p-6">
          <LeadForm type="consult" title="Đăng ký tư vấn" />
        </div>
        <div id="chuong-trinh" className="space-y-10">
          <div className="border border-vabix-deep-teal/10 p-6">
            <LeadForm type="connect" title="Kết nối doanh nghiệp" />
          </div>
          <div id="su-kien" className="border border-vabix-deep-teal/10 p-6">
            <LeadForm type="program" title="Đăng ký chương trình" />
          </div>
        </div>
      </Container>
    </>
  );
}

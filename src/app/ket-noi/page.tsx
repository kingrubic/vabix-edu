import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Section";
import { LeadForm } from "@/components/forms/LeadForm";
import { createMetadata } from "@/lib/seo";
import { pillars } from "@/content/pillars";
import Link from "next/link";

export const metadata = createMetadata({
  title: "Trao đổi nhu cầu doanh nghiệp",
  description: "Đăng ký tư vấn đào tạo, chuyển đổi doanh nghiệp, Trustworking hoặc hợp tác cùng VABIX.",
  path: "/ket-noi",
});

export default function ConnectPage() {
  return (
    <>
      <PageHero
        title="Trao đổi nhu cầu doanh nghiệp"
        description="Bắt đầu từ bài toán thực tế. Một cuộc trao đổi đúng trọng tâm thường tiết kiệm hơn nhiều tháng vận hành lệch hướng."
        crumbs={[{ name: "Trang chủ", href: "/" }, { name: "Kết nối" }]}
      />
      <Container className="grid gap-6 py-10 sm:grid-cols-3">
        {pillars.map((p) => (
          <Link key={p.id} href={p.href} className="border border-vabix-deep-teal/10 p-5 hover:border-vabix-gold">
            <p className="eyebrow">{p.en}</p>
            <h2 className="mt-1 font-semibold text-vabix-deep-teal">{p.vi}</h2>
          </Link>
        ))}
      </Container>
      <Container className="grid gap-10 pb-16 lg:grid-cols-2">
        <div id="tu-van" className="border border-vabix-deep-teal/10 p-6">
          <LeadForm type="consult" title="Tư vấn doanh nghiệp" />
        </div>
        <div className="space-y-10">
          <div id="chuong-trinh" className="border border-vabix-deep-teal/10 p-6">
            <LeadForm type="program" title="Đăng ký / tư vấn chương trình" />
          </div>
          <div id="trustworking" className="border border-vabix-deep-teal/10 p-6">
            <LeadForm type="connect" title="Trustworking / hợp tác" />
          </div>
        </div>
      </Container>
    </>
  );
}

import { caseStudies } from "@/content/caseStudies";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Section";
import { CaseStudyCard } from "@/components/cards/Cards";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Case Study",
  description: "Đồng hành thực chiến cùng VNPT, SIHUB, SUSPRO và các doanh nghiệp Việt.",
  path: "/tri-thuc/case-study",
});

export default function CaseStudiesPage() {
  return (
    <>
      <PageHero
        title="Đồng hành thực chiến. Kiến tạo giá trị thực tế."
        description="Các chương trình tư vấn, đào tạo và chuyển đổi được triển khai trên bài toán thật của tổ chức."
        crumbs={[{ name: "Trang chủ", href: "/" }, { name: "Tri thức", href: "/tri-thuc" }, { name: "Case Study" }]}
      />
      <Container className="grid gap-6 py-16 md:grid-cols-3">
        {caseStudies.map((c) => (
          <CaseStudyCard key={c.id} item={c} />
        ))}
      </Container>
    </>
  );
}

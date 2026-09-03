import { notFound } from "next/navigation";
import { handbooks } from "@/content/network";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Section";
import { CTASection } from "@/components/sections/CTASection";
import { createMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return handbooks.map((h) => ({ slug: h.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const h = handbooks.find((x) => x.slug === slug);
  if (!h) return {};
  return createMetadata({ title: h.title, description: h.summary, path: `/tri-thuc/cam-nang/${h.slug}` });
}

export default async function HandbookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const h = handbooks.find((x) => x.slug === slug);
  if (!h) notFound();
  return (
    <>
      <PageHero
        title={h.title}
        description={h.summary}
        crumbs={[
          { name: "Trang chủ", href: "/" },
          { name: "Cẩm nang", href: "/tri-thuc/cam-nang" },
          { name: h.title },
        ]}
      />
      <Container className="py-16">
        <p className="measure text-vabix-muted">
          Cẩm nang này được chuyển từ chuyên mục Cẩm nang trên website VABIX. Nội dung chi tiết tiếp tục được cập nhật trên kho tri thức. Để nhận bản đầy đủ hoặc trao đổi chuyên đề, vui lòng kết nối với VABIX.
        </p>
      </Container>
      <CTASection title="Cần cẩm nang cho ngành của bạn?" description="VABIX hỗ trợ doanh nhân Việt viết sách và biên soạn tri thức ngành." />
    </>
  );
}

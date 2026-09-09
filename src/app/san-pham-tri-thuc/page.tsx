import { PageHero } from "@/components/layout/PageHero";
import { Container, SectionHeading } from "@/components/ui/Section";
import { CTASection } from "@/components/sections/CTASection";
import { knowledgeProductCategories, knowledgeProducts } from "@/content/knowledgeProducts";
import { createMetadata } from "@/lib/seo";
import Link from "next/link";

export const metadata = createMetadata({
  title: "Sản phẩm tri thức",
  description: "Sách, cẩm nang, bộ biểu mẫu quản trị và học liệu số — hỗ trợ doanh chủ chuyển kiến thức thành quyết định và hành động.",
  path: "/san-pham-tri-thuc",
});

export default function KnowledgeProductsPage() {
  return (
    <>
      <PageHero
        title="Sản phẩm tri thức"
        description="Hỗ trợ doanh chủ chuyển kiến thức thành quyết định, hành động và kết quả. Phân biệt với bài viết / blog miễn phí. Mua hàng, thanh toán và tải tài liệu chỉ mở khi sản phẩm, quyền truy cập và quy trình kinh doanh đã sẵn sàng."
        crumbs={[{ name: "Trang chủ", href: "/" }, { name: "Sản phẩm tri thức" }]}
      />
      <Container className="grid gap-4 py-16 md:grid-cols-2">
        {knowledgeProductCategories.map((c) => (
          <Link key={c.id} href={c.href} className="border border-vabix-deep-teal/10 p-7 hover:border-vabix-gold">
            <h2 className="text-xl font-semibold text-vabix-deep-teal">{c.title}</h2>
            <p className="mt-3 text-sm text-vabix-muted">{c.summary}</p>
          </Link>
        ))}
      </Container>
      <section className="bg-vabix-ivory py-16">
        <Container>
          <SectionHeading title="Danh mục hiện có" />
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {knowledgeProducts.map((p) => (
              <article key={p.id} className="bg-white p-6">
                <p className="eyebrow">{p.status === "coming" ? "Chưa mở truy cập công khai" : "Ấn phẩm"}</p>
                <h3 className="mt-2 text-lg font-semibold text-vabix-deep-teal">{p.title}</h3>
                <p className="mt-3 text-sm text-vabix-muted">{p.summary}</p>
                {p.href && p.status === "published" ? (
                  <Link href={p.href} className="mt-4 inline-block text-sm font-semibold text-vabix-deep-teal">
                    Xem chi tiết
                  </Link>
                ) : (
                  <p className="mt-4 text-sm text-vabix-muted">Liên hệ tư vấn khi cần sử dụng trong chương trình hoặc tư vấn.</p>
                )}
              </article>
            ))}
          </div>
        </Container>
      </section>
      <CTASection title="Dùng tri thức đúng lúc cần quyết định." description="VABIX không tự bịa sách, giá, ISBN hay file tải. Sản phẩm mới chỉ công bố khi đã được phê duyệt." />
    </>
  );
}

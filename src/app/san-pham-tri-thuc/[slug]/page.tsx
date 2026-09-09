import { notFound, redirect } from "next/navigation";
import {
  getKnowledgeProduct,
  knowledgeProductCanonicalPath,
  knowledgeProductPagePath,
  knowledgeProductsOnOwnRoute,
} from "@/content/knowledgeProducts";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Section";
import { LeadForm } from "@/components/forms/LeadForm";
import { createMetadata } from "@/lib/seo";
import Link from "next/link";

export function generateStaticParams() {
  return knowledgeProductsOnOwnRoute().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getKnowledgeProduct(slug);
  if (!p) return {};
  const canonical = knowledgeProductCanonicalPath(p);
  if (canonical !== knowledgeProductPagePath(p)) return {};
  return createMetadata({ title: p.title, description: p.summary, path: canonical });
}

export default async function KnowledgeProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getKnowledgeProduct(slug);
  if (!p) notFound();
  const canonical = knowledgeProductCanonicalPath(p);
  if (canonical !== knowledgeProductPagePath(p)) redirect(canonical);
  return (
    <>
      <PageHero
        title={p.title}
        description={p.summary}
        crumbs={[
          { name: "Trang chủ", href: "/" },
          { name: "Sản phẩm tri thức", href: "/san-pham-tri-thuc" },
          { name: p.title },
        ]}
      />
      <Container className="grid gap-10 py-16 lg:grid-cols-2">
        <div>
          {p.status === "coming" ? (
            <p className="text-vabix-muted">
              Sản phẩm này đã được định vị trong hệ sinh thái nhưng chưa mở mua hàng, thanh toán hoặc tải file công khai. VABIX không công bố giá, ISBN hay tài liệu giả.
            </p>
          ) : (
            <p className="text-vabix-muted">Ấn phẩm hiện có trong kho tri thức VABIX. Không có giá bán công khai trên website này.</p>
          )}
          {p.href && p.status === "published" ? (
            <Link href={p.href} className="mt-6 inline-block font-semibold text-vabix-deep-teal">
              Xem trang ấn phẩm
            </Link>
          ) : null}
        </div>
        <div className="border border-vabix-deep-teal/10 p-6">
          <LeadForm type="consult" title="Liên hệ về sản phẩm tri thức" program={p.slug} />
        </div>
      </Container>
    </>
  );
}

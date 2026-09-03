import { notFound } from "next/navigation";
import { collections } from "@/content/network";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Section";
import { createMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = collections.find((x) => x.slug === slug);
  if (!c) return {};
  return createMetadata({ title: c.title, description: c.summary, path: `/bo-suu-tap/${c.slug}` });
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = collections.find((x) => x.slug === slug);
  if (!c) notFound();
  return (
    <>
      <PageHero title={c.title} description={c.summary} crumbs={[{ name: "Trang chủ", href: "/" }, { name: "Bộ sưu tập", href: "/bo-suu-tap" }, { name: c.title }]} />
      <Container className="py-16">
        <p className="measure text-vabix-muted">
          Bộ sưu tập này được chuyển từ chuyên mục tương ứng trên website VABIX. Hình ảnh sự kiện và chứng nhận tiếp tục được bổ sung khi có bản gốc chất lượng cao từ đội ngũ vận hành.
        </p>
      </Container>
    </>
  );
}

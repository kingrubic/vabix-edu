import { articleCategories } from "@/content/articles";
import { publishedArticlesByCategory } from "@/platform/cms/catalog";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Section";
import { ArticleCard } from "@/components/cards/Cards";
import { createMetadata } from "@/lib/seo";
import Link from "next/link";
import type { ArticleCategory } from "@/content/types";

export const metadata = createMetadata({
  title: "Tri thức VABIX",
  description: "Kho tri thức VABIX: chiến lược, quản trị, BizCar, marketing, lãnh đạo, AI và hoạt động.",
  path: "/tri-thuc",
});

export default async function KnowledgePage({
  searchParams,
}: {
  searchParams: Promise<{ "chuyen-muc"?: string }>;
}) {
  const sp = await searchParams;
  const cat = sp["chuyen-muc"] as ArticleCategory | undefined;
  const list = publishedArticlesByCategory(cat && articleCategories.some((c) => c.id === cat) ? cat : undefined);
  return (
    <>
      <PageHero
        title="Tri thức VABIX"
        description="Không phải tin tức khuyến mãi. Đây là kho tri thức: insights, phương pháp, case study và hoạt động thực chiến."
        crumbs={[{ name: "Trang chủ", href: "/" }, { name: "Tri thức" }]}
      />
      <Container className="py-12">
        <div className="flex flex-wrap gap-2">
          <Link href="/tri-thuc" className="border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide">
            Tất cả
          </Link>
          {articleCategories.map((c) => (
            <Link key={c.id} href={`/tri-thuc?chuyen-muc=${c.id}`} className="border border-vabix-deep-teal/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-vabix-deep-teal">
              {c.label}
            </Link>
          ))}
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {list.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      </Container>
    </>
  );
}

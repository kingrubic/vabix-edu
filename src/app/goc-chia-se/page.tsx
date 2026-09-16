import { articleCategories } from "@/content/articles";
import { publishedArticlesByCategory } from "@/platform/cms/catalog";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Section";
import { ArticleCard } from "@/components/cards/Cards";
import { createMetadata } from "@/lib/seo";
import { paths } from "@/lib/paths";
import Link from "next/link";
import type { ArticleCategory } from "@/content/types";

export const metadata = createMetadata({
  title: "Góc chia sẻ",
  description: "Bài viết, case, tin tức / sự kiện và nội dung chuyên môn của VABIX.",
  path: paths.insights,
});

export default async function InsightsPage({
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
        title="Góc chia sẻ"
        description="Bài viết, case / hoạt động, tin tức / sự kiện và nội dung chuyên môn. Không đăng ghi chú biên tập."
        crumbs={[{ name: "Trang chủ", href: "/" }, { name: "Góc chia sẻ" }]}
      />
      <Container className="py-12">
        <div className="flex flex-wrap gap-2">
          <Link href={paths.insights} className="border px-3 py-1.5 text-xs font-semibold tracking-wide uppercase">
            Tất cả
          </Link>
          {articleCategories.map((c) => (
            <Link key={c.id} href={`${paths.insights}?chuyen-muc=${c.id}`} className="border border-vabix-deep-teal/15 px-3 py-1.5 text-xs font-semibold tracking-wide text-vabix-deep-teal uppercase">
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

import { notFound } from "next/navigation";
import { articles } from "@/content/articles";
import { publishedArticle, publishedArticles } from "@/platform/cms/catalog";
import { PageHero, Prose } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Section";
import { JsonLd } from "@/components/ui/Misc";
import { CTASection } from "@/components/sections/CTASection";
import { createMetadata, absUrl } from "@/lib/seo";
import { siteConfig } from "@/lib/siteConfig";

export function generateStaticParams() {
  const slugs = new Set(articles.map((item) => item.slug));
  try {
    for (const item of publishedArticles()) slugs.add(item.slug);
  } catch {
    /* file fallback */
  }
  return [...slugs].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = publishedArticle(slug);
  if (!a) return {};
  return createMetadata({
    title: a.title,
    description: a.excerpt,
    path: `/tri-thuc/${a.slug}`,
    type: "article",
    image: a.coverImage,
  });
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = publishedArticle(slug);
  if (!a) notFound();
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: a.title,
          datePublished: a.publishedAt,
          author: { "@type": "Person", name: a.author },
          publisher: { "@type": "Organization", name: siteConfig.siteName },
          image: absUrl(a.coverImage),
          description: a.excerpt,
        }}
      />
      <PageHero
        eyebrow={a.categoryLabel}
        title={a.title}
        description={a.excerpt}
        crumbs={[{ name: "Trang chủ", href: "/" }, { name: "Tri thức", href: "/tri-thuc" }, { name: a.title }]}
      />
      <Container className="py-16">
        <p className="text-sm text-vabix-muted">
          {a.author} · {new Date(a.publishedAt).toLocaleDateString("vi-VN")}
        </p>
        <Prose>
          {a.content.split("\n\n").map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </Prose>
      </Container>
      <CTASection title="Muốn áp dụng tri thức này vào doanh nghiệp?" description="Trao đổi với VABIX để xác định bước đi phù hợp." />
    </>
  );
}

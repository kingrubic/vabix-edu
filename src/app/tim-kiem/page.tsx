import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Section";
import { createMetadata } from "@/lib/seo";
import { paths } from "@/lib/paths";
import { publishedPrograms, publishedArticles, publishedMethodologies, publishedKnowledgeProducts } from "@/platform/cms/catalog";
import { books } from "@/content/network";
import Link from "next/link";

export const metadata = createMetadata({
  title: "Tìm kiếm",
  description: "Tìm chương trình, bài viết, sách và mô hình VABIX.",
  path: paths.search,
});

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const query = q.trim().toLowerCase();
  const results: { type: string; href: string; title: string; excerpt: string }[] = [];
  if (query) {
    for (const p of publishedPrograms()) {
      const hay = [p.title, p.shortTitle, p.audience, p.problem].join(" ").toLowerCase();
      if (hay.includes(query)) results.push({ type: "Chương trình", href: paths.program(p.slug), title: p.title, excerpt: p.audience });
    }
    for (const a of publishedArticles()) {
      const hay = [a.title, a.excerpt, a.content].join(" ").toLowerCase();
      if (hay.includes(query)) results.push({ type: "Bài viết", href: paths.article(a.slug), title: a.title, excerpt: a.excerpt });
    }
    for (const b of books) {
      const hay = [b.title, b.summary].join(" ").toLowerCase();
      if (hay.includes(query)) results.push({ type: "Sách", href: `/tri-thuc/sach/${b.slug}`, title: b.title, excerpt: b.summary });
    }
    for (const m of publishedMethodologies()) {
      const hay = [m.name, m.summary, m.headline].join(" ").toLowerCase();
      if (hay.includes(query)) results.push({ type: "Mô hình", href: paths.method(m.slug), title: m.name, excerpt: m.summary });
    }
    for (const k of publishedKnowledgeProducts()) {
      const hay = [k.title, k.summary].join(" ").toLowerCase();
      if (hay.includes(query)) results.push({ type: "Tri thức", href: k.href ?? `/san-pham-tri-thuc/${k.slug}`, title: k.title, excerpt: k.summary });
    }
  }
  return (
    <>
      <PageHero title="Tìm kiếm" description="Chương trình, bài viết, sách và mô hình / phương pháp." crumbs={[{ name: "Trang chủ", href: "/" }, { name: "Tìm kiếm" }]} />
      <Container className="py-16">
        <form className="max-w-xl" action={paths.search} method="get">
          <label htmlFor="q" className="mb-2 block text-sm font-medium text-vabix-deep-teal">
            Từ khóa
          </label>
          <input id="q" name="q" defaultValue={q} className="input" placeholder="BMDO, KAROT, BizCar…" />
          <button className="mt-4 bg-vabix-deep-teal px-4 py-2 text-white">Tìm</button>
        </form>
        {query ? (
          <p className="mt-8 text-sm text-vabix-muted">{results.length} kết quả cho “{q}”.</p>
        ) : (
          <p className="mt-8 text-sm text-vabix-muted">Nhập từ khóa để tìm trong chương trình, bài viết, sách và mô hình.</p>
        )}
        <ul className="mt-6 space-y-4">
          {results.map((r) => (
            <li key={r.href} className="border-b border-vabix-deep-teal/10 pb-4">
              <p className="eyebrow">{r.type}</p>
              <Link href={r.href} className="text-lg font-semibold text-vabix-deep-teal">
                {r.title}
              </Link>
              <p className="mt-1 text-sm text-vabix-muted">{r.excerpt}</p>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}

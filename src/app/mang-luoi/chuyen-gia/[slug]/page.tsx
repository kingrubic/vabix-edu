import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { experts, getExpert } from "@/content/experts";
import { caseStudies } from "@/content/caseStudies";
import { articles } from "@/content/articles";
import { methodologies } from "@/content/methodologies";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Section";
import { CTASection } from "@/components/sections/CTASection";
import { JsonLd } from "@/components/ui/Misc";
import { createMetadata, absUrl } from "@/lib/seo";

export function generateStaticParams() {
  return experts.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const e = getExpert(slug);
  if (!e) return {};
  return createMetadata({ title: e.name, description: e.shortBio, path: `/mang-luoi/chuyen-gia/${e.slug}` });
}

export default async function ExpertDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const e = getExpert(slug);
  if (!e) notFound();
  const relatedCases = caseStudies.filter((c) => e.caseStudies.includes(c.slug));
  const relatedArticles = articles.filter((a) => e.articles.includes(a.slug));
  const relatedPrograms = methodologies.filter((m) => e.programs.includes(m.slug));

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: e.name,
          jobTitle: e.organizationRole,
          image: absUrl(e.portrait),
          worksFor: { "@type": "Organization", name: "VABIX" },
          description: e.shortBio,
        }}
      />
      <PageHero
        title={e.name}
        description={e.organizationRole}
        crumbs={[
          { name: "Trang chủ", href: "/" },
          { name: "Chuyên gia", href: "/mang-luoi/chuyen-gia" },
          { name: e.name },
        ]}
      />
      <Container className="grid gap-10 py-16 lg:grid-cols-[280px_1fr]">
        <div>
          <div className="relative aspect-square overflow-hidden rounded-full bg-vabix-deep-teal">
            <Image src={e.portrait} alt={e.name} fill className="object-cover object-top" sizes="280px" />
          </div>
          <p className="mt-4 font-semibold text-vabix-deep-teal">{e.title}</p>
          {e.linkedin ? (
            <a href={e.linkedin} className="mt-2 inline-block text-sm text-vabix-gold">
              LinkedIn
            </a>
          ) : null}
        </div>
        <div>
          <h2 className="text-xl font-semibold text-vabix-deep-teal">Lĩnh vực chuyên môn</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {e.expertise.map((x) => (
              <span key={x} className="border border-vabix-deep-teal/15 px-3 py-1 text-sm">
                {x}
              </span>
            ))}
          </div>
          <h2 className="mt-10 text-xl font-semibold text-vabix-deep-teal">Tiểu sử</h2>
          <p className="measure mt-3 text-vabix-muted">{e.fullBio}</p>
          {relatedPrograms.length ? (
            <>
              <h2 className="mt-10 text-xl font-semibold text-vabix-deep-teal">Chương trình</h2>
              <ul className="mt-3 space-y-2">
                {relatedPrograms.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/mo-hinh-phuong-phap/${p.slug}`} className="text-vabix-deep-teal">
                      {p.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
          {relatedCases.length ? (
            <>
              <h2 className="mt-10 text-xl font-semibold text-vabix-deep-teal">Case study</h2>
              <ul className="mt-3 space-y-2">
                {relatedCases.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/tri-thuc/case-study/${c.slug}`}>{c.organization}</Link>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
          {relatedArticles.length ? (
            <>
              <h2 className="mt-10 text-xl font-semibold text-vabix-deep-teal">Bài viết</h2>
              <ul className="mt-3 space-y-2">
                {relatedArticles.map((a) => (
                  <li key={a.slug}>
                    <Link href={`/tri-thuc/${a.slug}`}>{a.title}</Link>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </div>
      </Container>
      <CTASection title="Trao đổi cùng chuyên gia VABIX" description="Đặt lịch để xác định bài toán và hướng đồng hành phù hợp." />
    </>
  );
}

import { notFound } from "next/navigation";
import { caseStudies, getCaseStudy } from "@/content/caseStudies";
import { experts } from "@/content/experts";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Section";
import { CTASection } from "@/components/sections/CTASection";
import { createMetadata } from "@/lib/seo";
import Link from "next/link";

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getCaseStudy(slug);
  if (!c) return {};
  return createMetadata({
    title: `${c.organization} — ${c.industry}`,
    description: c.challenge,
    path: `/tri-thuc/case-study/${c.slug}`,
    image: c.coverImage,
  });
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getCaseStudy(slug);
  if (!c) notFound();
  const related = experts.filter((e) => c.relatedExperts.includes(e.slug));
  const sections = [
    { t: "Bối cảnh", b: c.context },
    { t: "Bài toán", b: c.challenge },
    { t: "Giải pháp", b: c.solution },
    { t: "Quá trình triển khai", b: c.implementation },
    { t: "Kết quả", b: c.results },
    { t: "Bài học", b: c.lesson },
  ];
  return (
    <>
      <PageHero
        eyebrow={c.organization}
        title={c.industry}
        description={c.challenge}
        crumbs={[
          { name: "Trang chủ", href: "/" },
          { name: "Case Study", href: "/tri-thuc/case-study" },
          { name: c.organization },
        ]}
      />
      <Container className="space-y-10 py-16">
        {sections.map((s) => (
          <section key={s.t}>
            <h2 className="text-2xl font-semibold text-vabix-deep-teal">{s.t}</h2>
            <p className="measure mt-3 text-vabix-muted">{s.b}</p>
          </section>
        ))}
        {c.quote ? (
          <blockquote className="border-l-2 border-vabix-gold pl-5 text-lg text-vabix-deep-teal">
            “{c.quote.text}”
            <footer className="mt-2 text-sm text-vabix-muted">
              {c.quote.author} · {c.quote.role}
            </footer>
          </blockquote>
        ) : null}
        <p className="text-sm">
          Phương pháp:{" "}
          {c.methodologies.map((m) => (
            <Link key={m} href={`/mo-hinh-phuong-phap/${m}`} className="mr-2 font-semibold text-vabix-deep-teal">
              {m}
            </Link>
          ))}
        </p>
        {related.length ? (
          <p className="text-sm">
            Chuyên gia:{" "}
            {related.map((e) => (
              <Link key={e.slug} href={`/mang-luoi/chuyen-gia/${e.slug}`} className="mr-2 font-semibold">
                {e.name}
              </Link>
            ))}
          </p>
        ) : null}
      </Container>
      <CTASection title="Muốn một chương trình được thiết kế theo bài toán của bạn?" description="VABIX không sao chép giáo trình. Chúng tôi thiết kế theo bối cảnh tổ chức." />
    </>
  );
}

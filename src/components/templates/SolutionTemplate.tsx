import { featuredExperts } from "@/content/experts";
import { caseStudies } from "@/content/caseStudies";
import { methodologies } from "@/content/methodologies";
import { PageHero } from "@/components/layout/PageHero";
import { Container, SectionHeading } from "@/components/ui/Section";
import { CTASection } from "@/components/sections/CTASection";
import { ExpertCard, CaseStudyCard } from "@/components/cards/Cards";
import { LeadForm } from "@/components/forms/LeadForm";
import { JsonLd } from "@/components/ui/Misc";
import { breadcrumbJsonLd } from "@/lib/seo";
import type { Solution } from "@/content/types";
import Link from "next/link";

export function SolutionTemplate({ solution }: { solution: Solution }) {
  const relatedExperts = featuredExperts.slice(0, 3);
  const relatedCases = caseStudies.filter((c) =>
    c.methodologies.some((m) => solution.methodologies.includes(m)),
  );
  const relatedMethods = methodologies.filter((m) => solution.methodologies.includes(m.slug));
  const crumbs = [
    { name: "Trang chủ", href: "/" },
    { name: "Giải pháp", href: "/giai-phap" },
    { name: solution.title },
  ];

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(
          crumbs.map((c) => ({ name: c.name, path: c.href ?? `/giai-phap/${solution.slug}` })),
        )}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: solution.faqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }}
      />
      <PageHero eyebrow={`Giải pháp 0${solution.number.replace(/^0/, "") === solution.number ? solution.number : solution.number}`} title={solution.title} description={solution.summary} crumbs={crumbs} />

      <Container className="grid gap-12 py-16 lg:grid-cols-3">
        <div className="space-y-14 lg:col-span-2">
          <section>
            <SectionHeading title="Dành cho ai" />
            <ul className="mt-5 list-disc space-y-2 pl-5 text-vabix-ink">
              {solution.whoFor.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </section>
          <section>
            <SectionHeading title="Bài toán doanh nghiệp" />
            <ul className="mt-5 space-y-3">
              {solution.painPoints.map((x) => (
                <li key={x} className="border-l-2 border-vabix-gold pl-4 text-vabix-ink">
                  {x}
                </li>
              ))}
            </ul>
          </section>
          <section>
            <SectionHeading title="Kết quả kỳ vọng" />
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {solution.outcomes.map((x) => (
                <li key={x} className="bg-vabix-ivory p-4 text-sm text-vabix-deep-teal">
                  {x}
                </li>
              ))}
            </ul>
          </section>
          <section>
            <SectionHeading title="Phạm vi giải pháp" />
            <ul className="mt-5 list-disc space-y-2 pl-5">
              {solution.scope.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </section>
          <section>
            <SectionHeading title="Quy trình đồng hành" />
            <ol className="mt-6 grid gap-5 sm:grid-cols-2">
              {solution.process.map((p) => (
                <li key={p.step} className="border-t border-vabix-gold pt-4">
                  <p className="text-sm font-semibold text-vabix-gold">{p.step}</p>
                  <h3 className="mt-1 font-semibold text-vabix-deep-teal">{p.title}</h3>
                  <p className="mt-1 text-sm text-vabix-muted">{p.body}</p>
                </li>
              ))}
            </ol>
          </section>
          <section>
            <SectionHeading title="Sản phẩm bàn giao" />
            <ul className="mt-5 list-disc space-y-2 pl-5">
              {solution.deliverables.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </section>
          <section>
            <SectionHeading title="Phương pháp liên quan" />
            <div className="mt-5 flex flex-wrap gap-3">
              {relatedMethods.map((m) => (
                <Link key={m.slug} href={`/mo-hinh-phuong-phap/${m.slug}`} className="border border-vabix-deep-teal/15 px-4 py-2 text-sm font-semibold text-vabix-deep-teal">
                  {m.shortName}
                </Link>
              ))}
            </div>
          </section>
          {solution.faqs.length ? (
            <section>
              <SectionHeading title="Câu hỏi thường gặp" />
              <div className="mt-5 space-y-4">
                {solution.faqs.map((f) => (
                  <details key={f.question} className="border border-vabix-deep-teal/10 p-4">
                    <summary className="cursor-pointer font-semibold text-vabix-deep-teal">{f.question}</summary>
                    <p className="mt-3 text-sm text-vabix-muted">{f.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          ) : null}
        </div>
        <aside>
          <div className="border border-vabix-deep-teal/10 bg-white p-6 lg:sticky lg:top-28">
            <LeadForm type="consult" title="Đăng ký tư vấn" />
          </div>
        </aside>
      </Container>

      <section className="bg-vabix-ivory py-16">
        <Container>
          <SectionHeading title="Chuyên gia đồng hành" />
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {relatedExperts.map((e) => (
              <ExpertCard key={e.id} expert={e} />
            ))}
          </div>
        </Container>
      </section>
      {relatedCases.length ? (
        <section className="py-16">
          <Container>
            <SectionHeading title="Case study liên quan" />
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {relatedCases.slice(0, 2).map((c) => (
                <CaseStudyCard key={c.id} item={c} />
              ))}
            </div>
          </Container>
        </section>
      ) : null}
      <CTASection title="Trao đổi cùng VABIX về bài toán của bạn." description="Một cuộc trao đổi đúng trọng tâm thường tiết kiệm hơn nhiều tháng vận hành lệch hướng." />
    </>
  );
}

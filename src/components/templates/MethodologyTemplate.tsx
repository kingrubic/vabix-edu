import type { ReactNode } from "react";
import { PageHero } from "@/components/layout/PageHero";
import { Container, SectionHeading } from "@/components/ui/Section";
import { CTASection } from "@/components/sections/CTASection";
import { LeadForm } from "@/components/forms/LeadForm";
import { JsonLd } from "@/components/ui/Misc";
import { breadcrumbJsonLd } from "@/lib/seo";
import type { Methodology } from "@/content/types";

export function MethodologyTemplate({ method, extra }: { method: Methodology; extra?: ReactNode }) {
  const crumbs = [
    { name: "Trang chủ", href: "/" },
    { name: "Chương trình & Mô hình", href: "/mo-hinh-phuong-phap" },
    { name: method.shortName },
  ];
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs.map((c) => ({ name: c.name, path: c.href ?? `/mo-hinh-phuong-phap/${method.slug}` })))} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Course",
          name: method.name,
          description: method.summary,
          provider: { "@type": "Organization", name: "VABIX" },
        }}
      />
      <PageHero dark eyebrow={method.eyebrow} title={method.name} description={method.headline} crumbs={crumbs} />
      <Container className="grid gap-12 py-16 lg:grid-cols-3">
        <div className="space-y-10 lg:col-span-2">
          <p className="max-w-2xl text-lg text-vabix-ink">{method.summary}</p>
          <p className="max-w-2xl text-vabix-muted">{method.description}</p>
          {extra}
          <section>
            <SectionHeading title="Phù hợp với ai" />
            <ul className="mt-4 list-disc pl-5">
              {method.whoFor.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </section>
          <section>
            <SectionHeading title="Kết quả hướng tới" />
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {method.outcomes.map((x) => (
                <li key={x} className="bg-vabix-ivory p-4 text-sm">
                  {x}
                </li>
              ))}
            </ul>
          </section>
          <section>
            <SectionHeading title="Hành trình" />
            <ol className="mt-6 grid gap-5 sm:grid-cols-2">
              {method.process.map((p) => (
                <li key={p.step} className="border-t border-vabix-gold pt-4">
                  <p className="text-sm font-semibold text-vabix-gold">{p.step}</p>
                  <h3 className="mt-1 font-semibold text-vabix-deep-teal">{p.title}</h3>
                  <p className="mt-1 text-sm text-vabix-muted">{p.body}</p>
                </li>
              ))}
            </ol>
          </section>
        </div>
        <aside>
          <div className="border border-vabix-deep-teal/10 bg-white p-6 lg:sticky lg:top-28">
            <LeadForm type="program" program={method.slug} title="Đăng ký chương trình" />
          </div>
        </aside>
      </Container>
      <CTASection title="Đưa mô hình vào bài toán của bạn." description="VABIX đồng hành từ nhận diện đến chuyển giao năng lực — không dừng ở infographic." />
    </>
  );
}

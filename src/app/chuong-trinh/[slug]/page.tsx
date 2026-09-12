import { notFound } from "next/navigation";
import { programs } from "@/content/programs";
import { programGroups } from "@/content/programs";
import { publishedProgram, publishedPrograms } from "@/platform/cms/catalog";
import { topicCategories } from "@/content/training";
import { PageHero } from "@/components/layout/PageHero";
import { Container, SectionHeading } from "@/components/ui/Section";
import { CTASection } from "@/components/sections/CTASection";
import { LeadForm } from "@/components/forms/LeadForm";
import { createMetadata } from "@/lib/seo";
import Link from "next/link";

export function generateStaticParams() {
  const slugs = new Set(programs.filter((item) => item.status === "published").map((item) => item.slug));
  try {
    for (const item of publishedPrograms()) slugs.add(item.slug);
  } catch {
    /* file fallback */
  }
  return [...slugs].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = publishedProgram(slug);
  if (!p) return {};
  return createMetadata({ title: p.title, description: p.seoDescription, path: `/chuong-trinh/${p.slug}` });
}

function Block({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <section>
      <SectionHeading title={title} />
      <ul className="mt-4 list-disc space-y-2 pl-5">
        {items.map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ul>
    </section>
  );
}

export default async function ProgramDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = publishedProgram(slug);
  if (!p) notFound();
  const groupLabel = programGroups.find((g) => g.id === p.group)?.label;
  const topics = p.topicCategories.map((id) => topicCategories.find((t) => t.id === id)?.label).filter(Boolean);
  const related = publishedPrograms().filter((x) => p.relatedPrograms.includes(x.slug));

  return (
    <>
      <PageHero
        eyebrow={groupLabel}
        title={p.title}
        description={p.englishName ? `${p.englishName}. ${p.audience}` : p.audience}
        crumbs={[
          { name: "Trang chủ", href: "/" },
          { name: "Chương trình", href: "/chuong-trinh" },
          { name: p.shortTitle },
        ]}
      />
      <Container className="grid gap-12 py-16 lg:grid-cols-3">
        <div className="space-y-10 lg:col-span-2">
          <p className="text-lg text-vabix-ink">{p.problem}</p>
          {p.duration ? (
            <p className="font-semibold text-vabix-deep-teal">Thời lượng: {p.duration}</p>
          ) : (
            <p className="text-vabix-muted">{p.durationNote ?? "Thời lượng được thiết kế theo nhu cầu"}</p>
          )}
          {topics.length ? <p className="text-sm text-vabix-muted">Lĩnh vực: {topics.join(" · ")}</p> : null}
          <Block title="Đối tượng" items={p.audienceList} />
          <section>
            <SectionHeading title="Bài toán" />
            <p className="mt-4 text-vabix-muted">{p.problem}</p>
          </section>
          <Block title="Mục tiêu" items={p.objectives} />
          <Block title="Nội dung / chuyên đề" items={p.topics} />
          <section>
            <SectionHeading title="Phương pháp" />
            <p className="mt-4 text-vabix-muted">{p.methodology}</p>
          </section>
          <Block title="Đầu ra" items={p.deliverables} />
          <Block title="Kết quả hướng đến" items={p.outcomes} />
          {p.certificate ? (
            <section>
              <SectionHeading title="Công nhận hoàn thành" />
              <p className="mt-4 text-vabix-muted">{p.certificate}</p>
            </section>
          ) : null}
          {p.relatedModels.length ? (
            <section>
              <SectionHeading title="Mô hình liên quan" />
              <div className="mt-4 flex flex-wrap gap-3">
                {p.relatedModels.map((m) => (
                  <Link key={m} href={`/mo-hinh-phuong-phap/${m}`} className="border border-vabix-deep-teal/15 px-4 py-2 text-sm font-semibold text-vabix-deep-teal">
                    {m.toUpperCase()}
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
          {related.length ? (
            <section>
              <SectionHeading title="Chương trình liên quan" />
              <ul className="mt-4 space-y-2">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link href={`/chuong-trinh/${r.slug}`} className="text-vabix-deep-teal">
                      {r.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
        <aside>
          <div className="border border-vabix-deep-teal/10 bg-white p-6 lg:sticky lg:top-28">
            <LeadForm type="program" program={p.slug} title="Liên hệ tư vấn chương trình" />
          </div>
        </aside>
      </Container>
      <CTASection title="Thiết kế theo nhu cầu doanh nghiệp." description="Khảo sát hiện trạng trước khi chốt nội dung, thời lượng và đội ngũ chuyên gia." />
    </>
  );
}

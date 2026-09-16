import { PageHero } from "@/components/layout/PageHero";
import { Container, SectionHeading } from "@/components/ui/Section";
import { knowledgeProductCategories, workforce } from "@/content/knowledgeProducts";
import { books, handbooks, supportServices } from "@/content/network";
import { createMetadata } from "@/lib/seo";
import { paths } from "@/lib/paths";
import { LeadForm } from "@/components/forms/LeadForm";
import Link from "next/link";

export const metadata = createMetadata({
  title: "Hệ sinh thái tri thức",
  description: "Sách, cẩm nang, học liệu số, nhân lực mở, nhân lực số và dịch vụ hỗ trợ của VABIX.",
  path: paths.knowledge,
});

export default function KnowledgeEcosystemPage() {
  return (
    <>
      <PageHero
        title="Hệ sinh thái tri thức"
        description="Sách, cẩm nang, học liệu, nhân lực mở, nhân lực số và dịch vụ hỗ trợ — lớp năng lực xuyên suốt 3T."
        crumbs={[{ name: "Trang chủ", href: "/" }, { name: "Hệ sinh thái tri thức" }]}
      />
      <Container className="py-16">
        <section id="sach">
          <SectionHeading title="Sách" />
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {books.map((b) => (
              <Link key={b.slug} href={`/tri-thuc/sach/${b.slug}`} className="border border-vabix-deep-teal/10 p-6 hover:border-vabix-gold">
                <h3 className="font-semibold text-vabix-deep-teal">{b.title}</h3>
                <p className="mt-2 text-sm text-vabix-muted">{b.summary}</p>
              </Link>
            ))}
          </div>
          <p className="mt-4 text-sm text-vabix-muted">Nguyễn Chí Thành có ấn phẩm tiếng Anh trên Amazon. Danh mục 06 tựa chỉ công bố khi có nguồn được duyệt trong CMS.</p>
        </section>
        <section className="mt-16" id="cam-nang">
          <SectionHeading title="Cẩm nang" />
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {handbooks.map((h) => (
              <Link key={h.slug} href={`/tri-thuc/cam-nang/${h.slug}`} className="border border-vabix-deep-teal/10 p-6 hover:border-vabix-gold">
                <h3 className="font-semibold text-vabix-deep-teal">{h.title}</h3>
                <p className="mt-2 text-sm text-vabix-muted">{h.summary}</p>
              </Link>
            ))}
          </div>
        </section>
        <section className="mt-16" id="hoc-lieu">
          <SectionHeading title="Học liệu số" />
          <p className="measure mt-4 text-vabix-muted">{knowledgeProductCategories.find((c) => c.id === "hoc-lieu")?.summary}</p>
        </section>
      </Container>
      <section className="bg-vabix-ivory py-16">
        <Container className="grid gap-8 lg:grid-cols-2">
          <article id="nhan-luc-mo" className="bg-white p-8">
            <p className="eyebrow">Nhân lực mở</p>
            <h2 className="mt-2 text-2xl font-semibold text-vabix-deep-teal">{workforce.openTalent.tagline}</h2>
            <p className="mt-4 text-vabix-muted">{workforce.openTalent.summary}</p>
            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm">
              {workforce.openTalent.services.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </article>
          <article id="nhan-luc-so" className="bg-white p-8">
            <p className="eyebrow">Nhân lực số</p>
            <h2 className="mt-2 text-2xl font-semibold text-vabix-deep-teal">{workforce.digitalTalent.tagline}</h2>
            <p className="mt-4 text-vabix-muted">{workforce.digitalTalent.summary}</p>
            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm">
              {workforce.digitalTalent.services.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
            <ul className="mt-4 space-y-1 text-sm text-vabix-muted">
              {workforce.digitalTalent.principles.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </article>
        </Container>
      </section>
      <Container className="grid gap-12 py-16 lg:grid-cols-3" id="dich-vu-ho-tro">
        <div className="lg:col-span-2">
          <SectionHeading title="Dịch vụ hỗ trợ" />
          <ul className="mt-6 space-y-3">
            {supportServices.map((s) => (
              <li key={s.slug}>
                <Link href={`/dich-vu-phu-tro/${s.slug}`} className="font-semibold text-vabix-deep-teal">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="border border-vabix-deep-teal/10 p-6">
          <LeadForm type="support-service" title="Nhu cầu dịch vụ hỗ trợ" />
        </div>
      </Container>
    </>
  );
}

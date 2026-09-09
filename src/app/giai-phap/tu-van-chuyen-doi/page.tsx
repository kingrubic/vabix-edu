import { PageHero } from "@/components/layout/PageHero";
import { Container, SectionHeading } from "@/components/ui/Section";
import { CTASection } from "@/components/sections/CTASection";
import { LeadForm } from "@/components/forms/LeadForm";
import {
  consultingProcess,
  consultingOutcomes,
  consultingPositioning,
  consultingNote,
  consultingServices,
} from "@/content/consulting";
import { createMetadata } from "@/lib/seo";
import Link from "next/link";
import { ArrowIcon } from "@/components/ui/Misc";

export const metadata = createMetadata({
  title: "Tư vấn chuyển đổi doanh nghiệp",
  description: consultingPositioning,
  path: "/giai-phap/tu-van-chuyen-doi",
});

export default function TransformationLandingPage() {
  return (
    <>
      <PageHero
        eyebrow="Transformation"
        title="Tư vấn chuyển đổi doanh nghiệp"
        description={consultingPositioning}
        crumbs={[
          { name: "Trang chủ", href: "/" },
          { name: "Giải pháp", href: "/giai-phap" },
          { name: "Tư vấn chuyển đổi" },
        ]}
      />
      <Container className="grid gap-12 py-16 lg:grid-cols-3">
        <div className="space-y-10 lg:col-span-2">
          <p className="max-w-3xl text-vabix-muted">{consultingNote}</p>
          <section>
            <SectionHeading title="Quy trình năm bước" />
            <ol className="mt-8 grid gap-5 sm:grid-cols-2">
              {consultingProcess.map((s) => (
                <li key={s.step} className="border-t border-vabix-gold pt-4">
                  <p className="text-sm font-semibold text-vabix-gold">{s.step}</p>
                  <h3 className="mt-1 font-semibold text-vabix-deep-teal">{s.title}</h3>
                  <p className="mt-2 text-sm text-vabix-muted">{s.body}</p>
                </li>
              ))}
            </ol>
          </section>
          <section>
            <SectionHeading title="Kết quả hướng đến" />
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {consultingOutcomes.map((x) => (
                <li key={x} className="bg-vabix-ivory p-4 text-sm text-vabix-deep-teal">
                  {x}
                </li>
              ))}
            </ul>
          </section>
        </div>
        <aside>
          <div className="border border-vabix-deep-teal/10 bg-white p-6 lg:sticky lg:top-28">
            <LeadForm type="consult" title="Trao đổi nhu cầu chuyển đổi" />
          </div>
        </aside>
      </Container>
      <section className="bg-vabix-ivory py-16">
        <Container>
          <SectionHeading title="Mười hai dịch vụ tư vấn" />
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {consultingServices.map((s) => (
              <Link key={s.slug} href={`/giai-phap/tu-van-chuyen-doi/${s.slug}`} className="bg-white p-6 hover:border-vabix-gold border border-transparent">
                <p className="text-sm font-semibold tracking-widest text-vabix-gold">{s.number}</p>
                <h3 className="mt-2 text-lg font-semibold text-vabix-deep-teal">{s.title}</h3>
                <p className="mt-3 text-sm text-vabix-muted">{s.summary}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-vabix-deep-teal">
                  Phạm vi & đầu ra <ArrowIcon />
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>
      <CTASection title="Bắt đầu từ hiện trạng, không từ giải pháp có sẵn." description="VABIX đồng hành đánh giá, thiết kế và triển khai — không cam kết ROI khi chưa có căn cứ." />
    </>
  );
}

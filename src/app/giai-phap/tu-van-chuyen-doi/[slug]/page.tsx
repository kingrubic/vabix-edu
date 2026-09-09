import { notFound } from "next/navigation";
import { consultingServices, getConsultingService, consultingProcess } from "@/content/consulting";
import { PageHero } from "@/components/layout/PageHero";
import { Container, SectionHeading } from "@/components/ui/Section";
import { CTASection } from "@/components/sections/CTASection";
import { LeadForm } from "@/components/forms/LeadForm";
import { createMetadata } from "@/lib/seo";
import Link from "next/link";

export function generateStaticParams() {
  return consultingServices.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = getConsultingService(slug);
  if (!s) return {};
  return createMetadata({ title: s.title, description: s.summary, path: `/giai-phap/tu-van-chuyen-doi/${s.slug}` });
}

export default async function ConsultingServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = getConsultingService(slug);
  if (!s) notFound();
  return (
    <>
      <PageHero
        eyebrow={`Dịch vụ ${s.number}`}
        title={s.title}
        description={s.summary}
        crumbs={[
          { name: "Trang chủ", href: "/" },
          { name: "Giải pháp", href: "/giai-phap" },
          { name: "Tư vấn chuyển đổi", href: "/giai-phap/tu-van-chuyen-doi" },
          { name: s.title },
        ]}
      />
      <Container className="grid gap-12 py-16 lg:grid-cols-3">
        <div className="space-y-10 lg:col-span-2">
          <section>
            <SectionHeading title="Phạm vi" />
            <ul className="mt-4 list-disc space-y-2 pl-5">
              {s.scope.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </section>
          <section>
            <SectionHeading title="Sản phẩm bàn giao" />
            <ul className="mt-4 list-disc space-y-2 pl-5">
              {s.deliverables.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </section>
          <section>
            <SectionHeading title="Kết quả hướng đến" />
            <ul className="mt-4 space-y-2">
              {s.outcomes.map((x) => (
                <li key={x} className="bg-vabix-ivory p-4 text-sm">
                  {x}
                </li>
              ))}
            </ul>
          </section>
          <section>
            <SectionHeading title="Nằm trong quy trình năm bước" />
            <p className="mt-3 text-sm text-vabix-muted">Mỗi dịch vụ được đặt trong cùng một cách làm: đánh giá — điểm nghẽn — thiết kế — triển khai — đo lường.</p>
            <ol className="mt-4 flex flex-wrap gap-2 text-sm">
              {consultingProcess.map((p) => (
                <li key={p.step} className="border border-vabix-deep-teal/15 px-3 py-1.5">
                  {p.step} {p.title}
                </li>
              ))}
            </ol>
          </section>
          <p className="text-sm text-vabix-muted">VABIX không cam kết ROI, doanh thu hay tỷ lệ cải thiện định lượng khi chưa có căn cứ đo lường.</p>
          <Link href="/giai-phap/tu-van-chuyen-doi" className="inline-block text-sm font-semibold text-vabix-deep-teal">
            ← Tất cả dịch vụ tư vấn
          </Link>
        </div>
        <aside>
          <div className="border border-vabix-deep-teal/10 bg-white p-6 lg:sticky lg:top-28">
            <LeadForm type="consult" title="Trao đổi về dịch vụ này" program={s.slug} />
          </div>
        </aside>
      </Container>
      <CTASection title="Trao đổi nhu cầu chuyển đổi." description="Bắt đầu từ hiện trạng và điểm nghẽn ưu tiên của doanh nghiệp bạn." />
    </>
  );
}

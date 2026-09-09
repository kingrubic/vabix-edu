import { pillars, supportingLayers } from "@/content/pillars";
import { PageHero } from "@/components/layout/PageHero";
import { Container, SectionHeading } from "@/components/ui/Section";
import { CTASection } from "@/components/sections/CTASection";
import { createMetadata } from "@/lib/seo";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export const metadata = createMetadata({
  title: "Giải pháp 3T",
  description:
    "Ba mũi nhọn VABIX: Đào tạo & huấn luyện, Tư vấn chuyển đổi doanh nghiệp, Trustworking — kết nối kinh doanh dựa trên niềm tin.",
  path: "/giai-phap",
});

export default function SolutionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Giải pháp"
        title="Ba mũi nhọn chiến lược 3T"
        description="Training & Coaching. Transformation. Trustworking. Sản phẩm tri thức và nhân lực là lớp hỗ trợ xuyên suốt — không phải trụ cột thứ tư."
        crumbs={[{ name: "Trang chủ", href: "/" }, { name: "Giải pháp" }]}
      />
      <Container className="grid gap-6 py-16 lg:grid-cols-3">
        {pillars.map((p) => (
          <article key={p.id} id={p.id} className="flex h-full flex-col border border-vabix-deep-teal/10 p-8">
            <p className="eyebrow">{p.en}</p>
            <h2 className="mt-2 text-2xl font-semibold text-vabix-deep-teal">{p.vi}</h2>
            <p className="mt-4 text-sm text-vabix-muted">{p.problem}</p>
            <p className="mt-4 text-vabix-ink">{p.value}</p>
            <ul className="mt-6 space-y-2 text-sm">
              {p.services.map((s) => (
                <li key={s.label}>
                  <Link href={s.href} className="font-medium text-vabix-deep-teal">
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-8">
              <Button href={p.href} variant="teal" className="w-full">
                {p.cta.label}
              </Button>
            </div>
          </article>
        ))}
      </Container>
      <section className="bg-vabix-ivory py-16">
        <Container>
          <SectionHeading title="Lớp năng lực hỗ trợ" description="Xuyên suốt hệ sinh thái, không ngang hàng 3T." />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {supportingLayers.map((l) => (
              <Link key={l.href} href={l.href} className="bg-white p-6 hover:border-vabix-gold border border-transparent">
                <h3 className="font-semibold text-vabix-deep-teal">{l.title}</h3>
                <p className="mt-2 text-sm text-vabix-muted">{l.summary}</p>
              </Link>
            ))}
          </div>
        </Container>
      </section>
      <CTASection title="Chọn điểm bắt đầu từ bài toán của bạn." description="Không bắt buộc đi tuần tự 3T. Trao đổi nhu cầu để xác định mũi nhọn phù hợp." />
    </>
  );
}

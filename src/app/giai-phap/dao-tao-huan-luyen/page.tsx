import { PageHero } from "@/components/layout/PageHero";
import { Container, SectionHeading } from "@/components/ui/Section";
import { CTASection } from "@/components/sections/CTASection";
import { LeadForm } from "@/components/forms/LeadForm";
import { trainingGroups, trainingMethod } from "@/content/training";
import { featuredPrograms, programs } from "@/content/programs";
import { threeW } from "@/content/threeW";
import { painPoints } from "@/content/about";
import { createMetadata } from "@/lib/seo";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export const metadata = createMetadata({
  title: "Đào tạo và huấn luyện",
  description:
    "Training & Coaching: phát triển năng lực lãnh đạo, quản trị và thực thi qua chương trình thực chiến, huấn luyện và sản phẩm ứng dụng được vào công việc.",
  path: "/giai-phap/dao-tao-huan-luyen",
});

export default function TrainingLandingPage() {
  return (
    <>
      <PageHero
        eyebrow="Training & Coaching"
        title="Đào tạo và huấn luyện thực chiến"
        description="Phát triển năng lực lãnh đạo, quản trị và thực thi. Học để nhìn rõ, thiết kế được và thực thi có bằng chứng — theo chuẩn WOW · WELL · WIN."
        crumbs={[
          { name: "Trang chủ", href: "/" },
          { name: "Giải pháp", href: "/giai-phap" },
          { name: "Đào tạo & huấn luyện" },
        ]}
      />

      <Container className="grid gap-12 py-16 lg:grid-cols-3">
        <div className="space-y-12 lg:col-span-2">
          <section>
            <SectionHeading title="Định vị và đối tượng" />
            <p className="measure mt-4 text-vabix-muted">
              Dành cho doanh chủ, CEO, ban lãnh đạo, đội ngũ quản lý và nhân sự cần nâng năng lực thực thi. Chương trình không phải khóa học đại trà: xuất phát từ bài toán doanh nghiệp và tạo sản phẩm quản trị có thể áp dụng.
            </p>
          </section>
          <section>
            <SectionHeading title="Bài toán doanh nghiệp thường gặp" />
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {painPoints.map((p) => (
                <li key={p} className="border-l-2 border-vabix-gold pl-4 text-sm text-vabix-ink">
                  {p}
                </li>
              ))}
            </ul>
          </section>
          <section id="nhom-chuong-trinh">
            <SectionHeading title="Sáu nhóm chương trình" />
            <div className="mt-8 space-y-6">
              {trainingGroups.map((g) => (
                <article key={g.id} className="border border-vabix-deep-teal/10 p-6">
                  <p className="text-sm font-semibold tracking-widest text-vabix-gold">{g.number}</p>
                  <h3 className="mt-1 text-xl font-semibold text-vabix-deep-teal">{g.title}</h3>
                  <p className="mt-3 text-sm text-vabix-muted">
                    <span className="font-semibold text-vabix-deep-teal">Đối tượng: </span>
                    {g.audience}
                  </p>
                  <p className="mt-2 text-sm text-vabix-ink">{g.goal}</p>
                  <p className="mt-3 text-sm text-vabix-muted">Chuyên đề: {g.topics.join("; ")}.</p>
                  <p className="mt-2 text-sm text-vabix-deep-teal">Đầu ra: {g.outcomes.join(" · ")}.</p>
                </article>
              ))}
            </div>
          </section>
        </div>
        <aside>
          <div className="border border-vabix-deep-teal/10 bg-white p-6 lg:sticky lg:top-28">
            <LeadForm type="program" title="Đăng ký / tư vấn chương trình" />
          </div>
        </aside>
      </Container>

      <section className="bg-vabix-ivory py-16">
        <Container>
          <SectionHeading title="Phương pháp đào tạo và chuẩn 3W" />
          <p className="measure mt-4 text-vabix-muted">{threeW.headline}</p>
          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {trainingMethod.steps.map((s) => (
              <li key={s.title} className="bg-white p-5">
                <h3 className="font-semibold text-vabix-deep-teal">{s.title}</h3>
                <p className="mt-2 text-sm text-vabix-muted">{s.body}</p>
              </li>
            ))}
          </ol>
          <h3 className="mt-10 text-lg font-semibold text-vabix-deep-teal">Đầu ra thực hành có thể gồm</h3>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {trainingMethod.possibleOutputs.map((x) => (
              <li key={x} className="text-sm text-vabix-ink">
                {x}
              </li>
            ))}
          </ul>
          <Link href="/mo-hinh-phuong-phap/3w" className="mt-6 inline-block text-sm font-semibold text-vabix-deep-teal">
            Xem khung 3W
          </Link>
        </Container>
      </section>

      <Container className="py-16">
        <SectionHeading title="Chương trình tiêu biểu" />
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {featuredPrograms()
            .filter((p) => p.group === "ceo" || p.slug === "dao-tao-theo-yeu-cau")
            .map((p) => (
              <Link key={p.slug} href={`/chuong-trinh/${p.slug}`} className="border border-vabix-deep-teal/10 p-6 hover:border-vabix-gold">
                <h3 className="font-semibold text-vabix-deep-teal">{p.title}</h3>
                <p className="mt-2 text-sm text-vabix-muted">{p.duration ?? p.durationNote}</p>
              </Link>
            ))}
        </div>
        <p className="mt-6 text-sm text-vabix-muted">{programs.length} chương trình / khóa trong danh mục, gồm đào tạo theo yêu cầu.</p>
        <div className="mt-6">
          <Button href="/chuong-trinh" variant="teal">
            Xem toàn bộ danh mục
          </Button>
        </div>
      </Container>

      <section className="bg-vabix-ivory py-16">
        <Container>
          <SectionHeading title="Thiết kế chương trình theo nhu cầu" />
          <ol className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {trainingMethod.designProcess.map((s) => (
              <li key={s.step} className="border-t border-vabix-gold pt-4">
                <p className="text-sm font-semibold text-vabix-gold">{s.step}</p>
                <h3 className="mt-1 font-semibold text-vabix-deep-teal">{s.title}</h3>
                <p className="mt-2 text-sm text-vabix-muted">{s.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <CTASection
        title="Trao đổi nhu cầu đào tạo của doanh nghiệp bạn."
        description="Khảo sát mục tiêu, đối tượng và hiện trạng trước khi đề xuất nội dung, thời lượng và chuyên gia."
        primary={{ label: "Đăng ký tư vấn chương trình", href: "/ket-noi#chuong-trinh" }}
      />
    </>
  );
}

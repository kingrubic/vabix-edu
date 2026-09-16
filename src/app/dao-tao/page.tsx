import { PageHero } from "@/components/layout/PageHero";
import { Container, SectionHeading } from "@/components/ui/Section";
import { CTASection } from "@/components/sections/CTASection";
import { LeadForm } from "@/components/forms/LeadForm";
import { ProgramCatalog } from "@/components/catalog/ProgramCatalog";
import { trainingMethod } from "@/content/training";
import { programGroups } from "@/content/programs";
import { publishedPrograms } from "@/platform/cms/catalog";
import { threeW } from "@/content/threeW";
import { createMetadata } from "@/lib/seo";
import { Button } from "@/components/ui/Button";
import { paths } from "@/lib/paths";
import Link from "next/link";

export const metadata = createMetadata({
  title: "Đào tạo và huấn luyện",
  description:
    "Học để nhìn rõ. Thiết kế để làm được. Triển khai để tạo kết quả. Training & Coaching cho doanh chủ, CEO, quản lý và đội ngũ.",
  path: paths.training,
});

export default function TrainingHubPage() {
  const programs = publishedPrograms();
  return (
    <>
      <PageHero
        eyebrow="Training & Coaching"
        title="Đào tạo và huấn luyện thực chiến"
        description="Học để nhìn rõ. Thiết kế để làm được. Triển khai để tạo kết quả."
        crumbs={[{ name: "Trang chủ", href: "/" }, { name: "Đào tạo & huấn luyện" }]}
      />
      <Container className="grid gap-12 py-16 lg:grid-cols-3">
        <div className="space-y-10 lg:col-span-2">
          <section>
            <SectionHeading title="Định vị" />
            <p className="measure mt-4 text-vabix-muted">
              Từ Thao trường CEO, huấn luyện 1:1 đến đào tạo theo nhu cầu doanh nghiệp — giúp người học nhìn rõ vấn đề, thiết kế giải pháp, ứng dụng vào công việc và đo lường kết quả.
            </p>
          </section>
          <section id="doanh-chu">
            <SectionHeading title="A. Dành cho Doanh chủ & CEO" />
            <ProgramList programs={programs.filter((p) => p.group === "ceo")} />
          </section>
          <section id="quan-ly">
            <SectionHeading title="B. Dành cho đội ngũ quản lý & nhân viên" />
            <ProgramList programs={programs.filter((p) => p.group === "management")} />
          </section>
          <section id="theo-yeu-cau">
            <SectionHeading title="C. Đào tạo theo yêu cầu doanh nghiệp" />
            <ProgramList programs={programs.filter((p) => p.group === "custom")} />
          </section>
        </div>
        <aside>
          <div className="border border-vabix-deep-teal/10 bg-white p-6 lg:sticky lg:top-28">
            <LeadForm type="training" title="Tư vấn đào tạo" />
          </div>
        </aside>
      </Container>
      <section className="bg-vabix-ivory py-16">
        <Container>
          <SectionHeading title="Phương pháp APPLIER và chuẩn 3W" />
          <p className="measure mt-4 text-vabix-muted">{trainingMethod.positioning}</p>
          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {trainingMethod.steps.map((s) => (
              <li key={s.title} className="bg-white p-5">
                <h3 className="font-semibold text-vabix-deep-teal">{s.title}</h3>
                <p className="mt-2 text-sm text-vabix-muted">{s.body}</p>
              </li>
            ))}
          </ol>
          <p className="mt-8 text-vabix-muted">{threeW.headline}</p>
          <Link href={paths.method("applier")} className="mt-4 mr-4 inline-block text-sm font-semibold text-vabix-deep-teal">
            Xem APPLIER
          </Link>
          <Link href={paths.method("3w")} className="mt-4 inline-block text-sm font-semibold text-vabix-deep-teal">
            Xem 3W
          </Link>
        </Container>
      </section>
      <Container className="py-16">
        <SectionHeading title="Toàn bộ danh mục" description={programGroups.map((g) => g.label).join(" · ")} />
        <div className="mt-8">
          <ProgramCatalog programs={programs} />
        </div>
        <div className="mt-8">
          <Button href={paths.programSchedule} variant="teal">
            Lịch học / lớp đang mở
          </Button>
        </div>
      </Container>
      <CTASection
        title="Trao đổi nhu cầu đào tạo của doanh nghiệp bạn."
        description="Khảo sát mục tiêu, đối tượng và hiện trạng trước khi đề xuất nội dung, thời lượng và chuyên gia."
        primary={{ label: "Đăng ký tư vấn chương trình", href: "/ket-noi#chuong-trinh" }}
      />
    </>
  );
}

function ProgramList({
  programs,
}: {
  programs: { slug: string; title: string; duration?: string; durationNote?: string; tagline?: string }[];
}) {
  return (
    <div className="mt-6 grid gap-3">
      {programs.map((p) => (
        <Link key={p.slug} href={paths.program(p.slug)} className="border border-vabix-deep-teal/10 p-5 hover:border-vabix-gold">
          <h3 className="font-semibold text-vabix-deep-teal">{p.title}</h3>
          <p className="mt-1 text-sm text-vabix-muted">{p.tagline ?? p.duration ?? p.durationNote}</p>
        </Link>
      ))}
    </div>
  );
}

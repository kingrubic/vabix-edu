import { PageHero } from "@/components/layout/PageHero";
import { Container, SectionHeading } from "@/components/ui/Section";
import { CTASection } from "@/components/sections/CTASection";
import { LeadForm } from "@/components/forms/LeadForm";
import { workforce } from "@/content/knowledgeProducts";
import { createMetadata } from "@/lib/seo";
import Link from "next/link";

export const metadata = createMetadata({
  title: "Nhân lực mở & Nhân lực số",
  description: workforce.positioning,
  path: "/nhan-luc-mo-nhan-luc-so",
});

export default function WorkforcePage() {
  return (
    <>
      <PageHero
        title="Nhân lực mở & Nhân lực số"
        description={workforce.positioning}
        crumbs={[{ name: "Trang chủ", href: "/" }, { name: "Nhân lực mở & nhân lực số" }]}
      />
      <Container className="grid gap-8 py-16 lg:grid-cols-2">
        <article className="border border-vabix-deep-teal/10 p-8">
          <p className="eyebrow">Hỗ trợ 3T</p>
          <h2 className="mt-2 text-2xl font-semibold text-vabix-deep-teal">{workforce.openTalent.title}</h2>
          <p className="mt-4 text-vabix-muted">{workforce.openTalent.summary}</p>
          <ul className="mt-6 list-disc space-y-2 pl-5">
            {workforce.openTalent.services.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
          <Link href="/mang-luoi/chuyen-gia" className="mt-6 inline-block text-sm font-semibold text-vabix-deep-teal">
            Xem mạng lưới chuyên gia
          </Link>
        </article>
        <article className="border border-vabix-gold/40 p-8">
          <p className="eyebrow">Hỗ trợ 3T</p>
          <h2 className="mt-2 text-2xl font-semibold text-vabix-deep-teal">{workforce.digitalTalent.title}</h2>
          <p className="mt-4 text-vabix-muted">{workforce.digitalTalent.summary}</p>
          <ul className="mt-6 list-disc space-y-2 pl-5">
            {workforce.digitalTalent.services.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
          <ul className="mt-6 space-y-2 text-sm text-vabix-muted">
            {workforce.digitalTalent.principles.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </article>
      </Container>
      <section className="bg-vabix-ivory py-16">
        <Container className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading title="Kết nối đúng năng lực, đúng giai đoạn" />
            <p className="measure mt-4 text-vabix-muted">
              Nhân lực thời vụ, diễn giả và kết nối KOL hiện có trong hệ sinh thái được giữ như dịch vụ phụ trợ — không nâng thành trụ cột. Dịch vụ cũ: hỗ trợ viết sách, nhân lực sự kiện, nhà diễn thuyết, KOL.
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/dich-vu-phu-tro/nhan-luc-thoi-vu" className="text-vabix-deep-teal">
                  Nhân lực thời vụ cho sự kiện
                </Link>
              </li>
              <li>
                <Link href="/dich-vu-phu-tro/nha-dien-thuyet" className="text-vabix-deep-teal">
                  Nhà diễn thuyết chuyên nghiệp
                </Link>
              </li>
              <li>
                <Link href="/dich-vu-phu-tro/ket-noi-kol" className="text-vabix-deep-teal">
                  Tư vấn và kết nối KOL
                </Link>
              </li>
            </ul>
          </div>
          <div className="border border-vabix-deep-teal/10 bg-white p-6">
            <LeadForm type="trust-expert" title="Nhu cầu nhân lực mở / nhân lực số" />
          </div>
        </Container>
      </section>
      <CTASection title="Bố trí năng lực theo bài toán, không theo khẩu hiệu AI." description="Quyền hạn, dữ liệu, trách nhiệm và phê duyệt vẫn thuộc về con người." />
    </>
  );
}

import { solutions } from "@/content/solutions";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Section";
import { SolutionCard } from "@/components/cards/Cards";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Giải pháp VABIX",
  description: "VABIX cung cấp tư vấn chiến lược, đào tạo doanh nhân, huấn luyện doanh nghiệp, kết nối doanh nghiệp và xúc tiến thương mại.",
  path: "/giai-phap",
});

export default function SolutionsPage() {
  const knowledge = solutions.filter((s) => s.pillar === "tri-thuc");
  const business = solutions.filter((s) => s.pillar === "kinh-doanh");
  return (
    <>
      <PageHero
        title="Giải pháp được thiết kế từ bài toán thực tế"
        description="Hai trụ cột — kết nối tri thức và kết nối kinh doanh — bổ sung cho nhau: nội lực vững thì kết nối mới ra giá trị."
        crumbs={[{ name: "Trang chủ", href: "/" }, { name: "Giải pháp" }]}
      />
      <Container className="py-16" id="tri-thuc">
        <h2 className="text-2xl font-semibold text-vabix-deep-teal">Kết nối tri thức</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {knowledge.map((s) => (
            <SolutionCard key={s.id} number={s.number} title={s.title} summary={s.summary} href={`/giai-phap/${s.slug}`} />
          ))}
        </div>
      </Container>
      <Container className="pb-16" id="kinh-doanh">
        <h2 className="text-2xl font-semibold text-vabix-deep-teal">Kết nối kinh doanh</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {business.map((s) => (
            <SolutionCard key={s.id} number={s.number} title={s.title} summary={s.summary} href={`/giai-phap/${s.slug}`} />
          ))}
        </div>
      </Container>
    </>
  );
}

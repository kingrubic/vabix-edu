import { experts } from "@/content/experts";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Section";
import { ExpertCard } from "@/components/cards/Cards";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Đội ngũ chuyên gia",
  description: "Mạng lưới chuyên gia VABIX — những người đã nghiên cứu, điều hành, cố vấn và triển khai giải pháp trong môi trường doanh nghiệp.",
  path: "/mang-luoi/chuyen-gia",
});

export default function ExpertsPage() {
  return (
    <>
      <PageHero
        title="Đội ngũ chuyên gia"
        description="VABIX quy tụ những chuyên gia đã trực tiếp nghiên cứu, điều hành, cố vấn và triển khai giải pháp trong môi trường doanh nghiệp."
        crumbs={[{ name: "Trang chủ", href: "/" }, { name: "Mạng lưới", href: "/mang-luoi" }, { name: "Chuyên gia" }]}
      />
      <Container className="grid gap-4 py-16 sm:grid-cols-2 lg:grid-cols-3">
        {experts.map((e) => (
          <ExpertCard key={e.id} expert={e} />
        ))}
      </Container>
    </>
  );
}

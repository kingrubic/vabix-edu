import { villages } from "@/content/network";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Section";
import { createMetadata } from "@/lib/seo";
import Link from "next/link";

export const metadata = createMetadata({
  title: "Làng ngành",
  description: "Các làng ngành trong VABIX — cộng đồng được liên kết để cùng phát triển.",
  path: "/mang-luoi/lang-nganh",
});

export default function VillagesPage() {
  return (
    <>
      <PageHero
        title="Làng ngành"
        description="Làng kết nối kinh doanh gồm các làng ngành được liên kết với nhau. Mỗi làng tập hợp nhà cung cấp được thẩm định theo định hướng của VABIX."
        crumbs={[{ name: "Trang chủ", href: "/" }, { name: "Mạng lưới", href: "/mang-luoi" }, { name: "Làng ngành" }]}
      />
      <Container className="grid gap-4 py-16 sm:grid-cols-2 lg:grid-cols-3">
        {villages.map((v) => (
          <Link key={v.slug} href={`/mang-luoi/lang-nganh/${v.slug}`} className="border border-vabix-deep-teal/10 p-6 hover:border-vabix-gold">
            <h2 className="font-semibold text-vabix-deep-teal">{v.name}</h2>
            <p className="mt-2 text-sm text-vabix-muted">{v.summary}</p>
          </Link>
        ))}
      </Container>
    </>
  );
}

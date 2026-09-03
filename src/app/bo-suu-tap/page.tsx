import { collections } from "@/content/network";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Section";
import { createMetadata } from "@/lib/seo";
import Link from "next/link";

export const metadata = createMetadata({
  title: "Bộ sưu tập",
  description: "Hình ảnh ký kết, đào tạo, kết nối và mẫu chứng nhận của VABIX.",
  path: "/bo-suu-tap",
});

export default function CollectionsPage() {
  return (
    <>
      <PageHero
        title="Bộ sưu tập"
        description="Tư liệu hình ảnh và chứng nhận được giữ lại từ website hiện hữu, sắp xếp trong kiến trúc mới."
        crumbs={[{ name: "Trang chủ", href: "/" }, { name: "Bộ sưu tập" }]}
      />
      <Container className="grid gap-4 py-16 md:grid-cols-2">
        {collections.map((c) => (
          <Link key={c.slug} href={`/bo-suu-tap/${c.slug}`} className="border border-vabix-deep-teal/10 p-6 hover:border-vabix-gold">
            <h2 className="font-semibold text-vabix-deep-teal">{c.title}</h2>
            <p className="mt-2 text-sm text-vabix-muted">{c.summary}</p>
          </Link>
        ))}
      </Container>
    </>
  );
}

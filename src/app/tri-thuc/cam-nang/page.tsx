import { handbooks } from "@/content/network";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Section";
import { createMetadata } from "@/lib/seo";
import Link from "next/link";

export const metadata = createMetadata({
  title: "Cẩm nang VABIX",
  description: "Cẩm nang ngành và kỹ năng — tri thức thực tiễn trong hệ sinh thái VABIX.",
  path: "/tri-thuc/cam-nang",
});

export default function HandbooksPage() {
  return (
    <>
      <PageHero
        title="Cẩm nang"
        description="Các cẩm nang hiện có trên nền tảng VABIX được giữ lại và sắp xếp lại trong kho tri thức."
        crumbs={[{ name: "Trang chủ", href: "/" }, { name: "Tri thức", href: "/tri-thuc" }, { name: "Cẩm nang" }]}
      />
      <Container className="grid gap-4 py-16 md:grid-cols-2">
        {handbooks.map((h) => (
          <Link key={h.slug} href={`/tri-thuc/cam-nang/${h.slug}`} className="border border-vabix-deep-teal/10 p-6 hover:border-vabix-gold">
            <h2 className="font-semibold text-vabix-deep-teal">{h.title}</h2>
            <p className="mt-2 text-sm text-vabix-muted">{h.summary}</p>
          </Link>
        ))}
      </Container>
    </>
  );
}

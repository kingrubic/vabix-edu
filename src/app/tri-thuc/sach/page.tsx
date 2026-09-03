import { books } from "@/content/network";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Section";
import { createMetadata } from "@/lib/seo";
import Link from "next/link";

export const metadata = createMetadata({
  title: "Sách VABIX",
  description: "Sách và ấn phẩm tri thức của VABIX, trong đó có Quản trị kinh doanh thực chiến theo mô hình B2A.",
  path: "/tri-thuc/sach",
});

export default function BooksPage() {
  return (
    <>
      <PageHero
        title="Sách VABIX"
        description="Tri thức được đóng thành sách để doanh nhân và đội ngũ có thể học, làm và truyền lại."
        crumbs={[{ name: "Trang chủ", href: "/" }, { name: "Tri thức", href: "/tri-thuc" }, { name: "Sách" }]}
      />
      <Container className="grid gap-4 py-16 md:grid-cols-2">
        {books.map((b) => (
          <Link key={b.slug} href={`/tri-thuc/sach/${b.slug}`} className="border border-vabix-deep-teal/10 p-7 hover:border-vabix-gold">
            <h2 className="text-xl font-semibold text-vabix-deep-teal">{b.title}</h2>
            <p className="mt-3 text-sm text-vabix-muted">{b.summary}</p>
          </Link>
        ))}
      </Container>
    </>
  );
}

import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Section";
import { createMetadata } from "@/lib/seo";
import Link from "next/link";

export const metadata = createMetadata({
  title: "Mạng lưới VABIX",
  description: "Chuyên gia, đối tác, làng ngành, nhà cung cấp — mạng lưới phải tạo ra giá trị.",
  path: "/mang-luoi",
});

const items = [
  { href: "/mang-luoi/chuyen-gia", title: "Đội ngũ chuyên gia", body: "Những người đã nghiên cứu, điều hành và triển khai thực chiến." },
  { href: "/mang-luoi/doi-tac", title: "Đối tác & khách hàng", body: "Tổ chức và doanh nghiệp đồng hành cùng VABIX." },
  { href: "/mang-luoi/lang-nganh", title: "Làng ngành", body: "Cộng đồng ngành được liên kết để cùng phát triển." },
  { href: "/mang-luoi/nha-cung-cap", title: "Nhà cung cấp", body: "Gian hàng số và hồ sơ năng lực trong Làng." },
  { href: "/mang-luoi/tro-thanh-doi-tac", title: "Trở thành đối tác", body: "Lộ trình thẩm định và đồng hành cùng VABIX." },
];

export default function NetworkPage() {
  return (
    <>
      <PageHero
        title="Mạng lưới phải tạo ra giá trị"
        description="VABIX kết nối doanh nghiệp, chuyên gia, đối tác và nguồn lực phù hợp — không kết nối cho có."
        crumbs={[{ name: "Trang chủ", href: "/" }, { name: "Mạng lưới" }]}
      />
      <Container className="grid gap-4 py-16 md:grid-cols-2">
        {items.map((i) => (
          <Link key={i.href} href={i.href} className="border border-vabix-deep-teal/10 p-7 hover:border-vabix-gold">
            <h2 className="text-xl font-semibold text-vabix-deep-teal">{i.title}</h2>
            <p className="mt-2 text-sm text-vabix-muted">{i.body}</p>
          </Link>
        ))}
      </Container>
    </>
  );
}

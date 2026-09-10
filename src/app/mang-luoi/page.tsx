import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Section";
import { createMetadata } from "@/lib/seo";
import Link from "next/link";

export const metadata = createMetadata({
  title: "Mạng lưới VABIX",
  description: "Chuyên gia, đối tác, làng ngành và nhà cung cấp — lớp mạng lưới của Trustworking, kết nối có chọn lọc dựa trên niềm tin.",
  path: "/mang-luoi",
});

const items = [
  { href: "/mang-luoi/chuyen-gia", title: "Đội ngũ chuyên gia", body: "Hồ sơ chuyên gia thực tế trong hệ sinh thái đào tạo, tư vấn và kết nối." },
  { href: "/mang-luoi/doi-tac", title: "Đối tác", body: "Tổ chức xuất hiện trong hồ sơ năng lực — phạm vi hợp tác cần xác nhận khi công bố." },
  { href: "/mang-luoi/lang-nganh", title: "Làng ngành", body: "Cộng đồng ngành được liên kết trong Trustworking." },
  { href: "/mang-luoi/nha-cung-cap", title: "Nhà cung cấp", body: "Hồ sơ năng lực cung cấp; sàng lọc ban đầu không đồng nghĩa bảo lãnh." },
  { href: "/mang-luoi/tro-thanh-doi-tac", title: "Trở thành đối tác", body: "Đề xuất hợp tác, giới thiệu giải pháp hoặc tìm đối tác." },
  { href: "/giai-phap/trustworking", title: "Trustworking", body: "Kết nối đúng nhà cung cấp với đúng thị trường." },
];

export default function NetworkPage() {
  return (
    <>
      <PageHero
        title="Mạng lưới trong Trustworking"
        description="VABIX kết nối có chọn lọc — không phải hội nhóm giao lưu hay sàn giao dịch. Mỗi bên tự thẩm định trước khi hợp tác."
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

import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Section";
import { siteConfig } from "@/lib/siteConfig";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Điều khoản sử dụng",
  description: "Điều khoản sử dụng website VABIX.",
  path: "/dieu-khoan",
});

export default function TermsPage() {
  return (
    <>
      <PageHero title="Điều khoản sử dụng" crumbs={[{ name: "Trang chủ", href: "/" }, { name: "Điều khoản" }]} />
      <Container className="py-16">
        <p className="measure text-vabix-muted">
          Nội dung trên {siteConfig.website} thuộc {siteConfig.legalName}. Việc sao chép tri thức, mô hình (BizCar, B2A, BABOSO, BMDO, KORA, KLASS) để thương mại hóa khi chưa có thỏa thuận bằng văn bản là không được phép. Việc kết nối, đào tạo và tư vấn chịu điều khoản hợp đồng riêng khi hai bên ký kết.
        </p>
      </Container>
    </>
  );
}

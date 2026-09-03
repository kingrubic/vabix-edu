import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Section";
import { siteConfig } from "@/lib/siteConfig";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Chính sách quyền riêng tư",
  description: "Chính sách quyền riêng tư của VABIX.",
  path: "/chinh-sach-quyen-rieng-tu",
});

export default function PrivacyPage() {
  return (
    <>
      <PageHero title="Chính sách quyền riêng tư" crumbs={[{ name: "Trang chủ", href: "/" }, { name: "Quyền riêng tư" }]} />
      <Container className="space-y-4 py-16 text-vabix-muted">
        <p className="measure">
          {siteConfig.legalName} thu thập họ tên, doanh nghiệp, chức vụ, điện thoại, email và nội dung trao đổi khi bạn gửi form trên website. Dữ liệu được dùng để liên hệ, tư vấn và cải thiện dịch vụ — không bán cho bên thứ ba.
        </p>
        <p className="measure">
          Bạn có quyền yêu cầu xem, sửa hoặc xóa dữ liệu bằng cách gửi email tới {siteConfig.contact.email}. Việc sử dụng website đồng nghĩa với việc bạn đã đọc chính sách này.
        </p>
      </Container>
    </>
  );
}

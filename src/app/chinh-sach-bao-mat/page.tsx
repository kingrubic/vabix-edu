import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Section";
import { siteConfig } from "@/lib/siteConfig";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Chính sách bảo mật thông tin",
  description: "Cam kết bảo mật thông tin của VABIX.",
  path: "/chinh-sach-bao-mat",
});

export default function SecurityPage() {
  return (
    <>
      <PageHero title="Chính sách bảo mật thông tin" crumbs={[{ name: "Trang chủ", href: "/" }, { name: "Bảo mật" }]} />
      <Container className="py-16">
        <p className="measure text-vabix-muted">
          VABIX áp dụng các biện pháp kỹ thuật và tổ chức phù hợp để hạn chế truy cập trái phép vào dữ liệu liên hệ. Thông tin đăng nhập Cổng Cư dân được quản lý trên hệ thống riêng ({siteConfig.portals.resident}). Khi phát hiện sự cố, vui lòng báo về {siteConfig.contact.supportEmail}.
        </p>
      </Container>
    </>
  );
}

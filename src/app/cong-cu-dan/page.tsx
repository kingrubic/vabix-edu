import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/siteConfig";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Cổng Cư dân VABIX",
  description: "Cổng vào dành cho Cư dân Cung cấp, Cư dân bán trú và Cư dân thường trú của Làng VABIX.",
  path: "/cong-cu-dan",
});

export default function ResidentPortalPage() {
  return (
    <>
      <PageHero
        title="Cổng Cư dân"
        description="Đây là cổng tiện ích dành cho cư dân kết nối của Làng VABIX — không phải mục điều hướng doanh nghiệp chính."
        crumbs={[{ name: "Trang chủ", href: "/" }, { name: "Cổng Cư dân" }]}
      />
      <Container className="grid gap-6 py-16 md:grid-cols-2">
        <article className="border border-vabix-deep-teal/10 p-7">
          <h2 className="text-xl font-semibold text-vabix-deep-teal">Đăng nhập cư dân</h2>
          <p className="mt-3 text-sm text-vabix-muted">
            Dành cho Cư dân Cung cấp, Cư dân bán trú và Cư dân thường trú. Nền tảng SMAR phục vụ học tập, kết nối và vận hành trong Làng.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button href={siteConfig.portals.resident} variant="teal">
              Vào SMAR
            </Button>
            <Button href={siteConfig.portals.login} variant="outline" className="border-vabix-deep-teal text-vabix-deep-teal">
              Đăng nhập website
            </Button>
          </div>
        </article>
        <article className="border border-vabix-deep-teal/10 p-7">
          <h2 className="text-xl font-semibold text-vabix-deep-teal">Cư dân học tập</h2>
          <p className="mt-3 text-sm text-vabix-muted">
            Khu vực đào tạo bắt buộc trước khi trở thành Cư dân Kết nối Chuyên nghiệp, theo tháp năng lực KLASS: kỹ năng giao tiếp, B2A, văn hóa Làng, AI và chăm sóc khách hàng.
          </p>
          <div className="mt-6">
            <Button href="/mo-hinh-phuong-phap/klass" variant="gold">
              Tìm hiểu KLASS
            </Button>
          </div>
        </article>
      </Container>
    </>
  );
}

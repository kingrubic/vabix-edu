import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/siteConfig";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Nhà cung cấp",
  description:
    "Gian hàng số của các nhà cung cấp trong Làng VABIX. Hồ sơ được sàng lọc ban đầu trong Trustworking — không đồng nghĩa chứng nhận pháp lý.",
  path: "/mang-luoi/nha-cung-cap",
});

export default function SuppliersPage() {
  return (
    <>
      <PageHero
        title="Gian hàng nhà cung cấp"
        description="Không gian số của các nhà cung cấp trong Làng VABIX. Việc tham gia được sàng lọc ban đầu — không phải gian hàng tự do, không phải chứng nhận pháp lý."
        crumbs={[{ name: "Trang chủ", href: "/" }, { name: "Mạng lưới", href: "/mang-luoi" }, { name: "Nhà cung cấp" }]}
      />
      <Container className="py-16">
        <p className="measure text-vabix-muted">
          Gian hàng số đang vận hành trên nền tảng hiện hữu của VABIX. Quý khách có thể tham quan, tìm hiểu năng lực nhà cung cấp và liên hệ kết nối.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href={siteConfig.portals.marketplace} variant="teal">
            Vào gian hàng số
          </Button>
          <Button href="/mang-luoi/tro-thanh-doi-tac" variant="outline" className="border-vabix-deep-teal text-vabix-deep-teal">
            Trở thành nhà cung cấp
          </Button>
        </div>
        <p className="measure mt-10 text-sm text-vabix-muted">
          Lời chứng thực cộng đồng được giữ trong hồ sơ nội bộ và chưa công bố trên trang này cho đến khi Founder xác nhận quyền sử dụng. Xem Trustworking để hiểu nguyên tắc sàng lọc và giới hạn trách nhiệm.
        </p>
        <div className="mt-4">
          <Button href="/giai-phap/trustworking" variant="outline" className="border-vabix-deep-teal text-vabix-deep-teal">
            Xem Trustworking
          </Button>
        </div>
      </Container>
    </>
  );
}

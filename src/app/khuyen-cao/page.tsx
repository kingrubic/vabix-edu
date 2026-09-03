import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Section";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Khuyến cáo quan trọng",
  description: "Khuyến cáo khi sử dụng thông tin và dịch vụ VABIX.",
  path: "/khuyen-cao",
});

export default function DisclaimerPage() {
  return (
    <>
      <PageHero title="Khuyến cáo quan trọng" crumbs={[{ name: "Trang chủ", href: "/" }, { name: "Khuyến cáo" }]} />
      <Container className="py-16">
        <p className="measure text-vabix-muted">
          Thông tin trên website mang tính giới thiệu năng lực và tri thức. Kết quả của từng chương trình phụ thuộc bối cảnh, nguồn lực và mức độ triển khai của doanh nghiệp. VABIX không cam kết doanh thu hay kết quả tài chính nếu chưa được nêu trong hợp đồng cụ thể.
        </p>
      </Container>
    </>
  );
}

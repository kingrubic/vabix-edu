import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Section";
import { ProgramCatalog } from "@/components/catalog/ProgramCatalog";
import { topicCategories } from "@/content/training";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Danh mục chương trình đào tạo",
  description:
    "BMDO, MBM, thao trường khởi nghiệp và các khóa phát triển năng lực lãnh đạo, quản lý, nhân viên. Thời lượng chỉ nêu khi đã xác nhận.",
  path: "/chuong-trinh",
});

export default function ProgramsPage() {
  return (
    <>
      <PageHero
        title="Danh mục chương trình đào tạo"
        description="Nhóm A — doanh chủ & CEO. Nhóm B — quản lý & nhân viên. Nhóm C — thiết kế theo yêu cầu sau khảo sát. Lọc theo bảy lĩnh vực chuyên đề."
        crumbs={[{ name: "Trang chủ", href: "/" }, { name: "Chương trình" }]}
      />
      <Container className="py-16">
        <p className="mb-8 text-sm text-vabix-muted">
          Lĩnh vực: {topicCategories.map((t) => t.label).join(" · ")}. Học phí, lịch khai giảng và giảng viên chỉ hiển thị khi đã được phê duyệt — hiện tại vui lòng liên hệ tư vấn.
        </p>
        <ProgramCatalog />
      </Container>
    </>
  );
}

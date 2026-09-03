import { methodologies } from "@/content/methodologies";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Section";
import { createMetadata } from "@/lib/seo";
import Link from "next/link";

export const metadata = createMetadata({
  title: "Chương trình & mô hình",
  description: "BizCar, BMDO, B2A, BABOSO, KORA, KLASS — nền tảng tri thức và phương pháp triển khai của VABIX.",
  path: "/mo-hinh-phuong-phap",
});

export default function MethodsIndexPage() {
  return (
    <>
      <PageHero
        title="Nền tảng tri thức & phương pháp triển khai"
        description="Mỗi mô hình là một ngôn ngữ chung để doanh nghiệp nhìn, thiết kế và vận hành — không phải bộ khẩu hiệu."
        crumbs={[{ name: "Trang chủ", href: "/" }, { name: "Chương trình & Mô hình" }]}
      />
      <Container className="grid gap-4 py-16 md:grid-cols-2">
        {methodologies.map((m) => (
          <Link key={m.slug} href={`/mo-hinh-phuong-phap/${m.slug}`} className="border border-vabix-deep-teal/10 p-7 hover:border-vabix-gold">
            <p className="eyebrow">{m.eyebrow}</p>
            <h2 className="mt-2 text-2xl font-semibold text-vabix-deep-teal">{m.name}</h2>
            <p className="mt-3 text-sm text-vabix-muted">{m.summary}</p>
          </Link>
        ))}
      </Container>
    </>
  );
}

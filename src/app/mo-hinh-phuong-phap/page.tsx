import { threeW } from "@/content/threeW";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Section";
import { createMetadata } from "@/lib/seo";
import { publishedMethodologies } from "@/platform/cms/catalog";
import Link from "next/link";

export const metadata = createMetadata({
  title: "Mô hình & phương pháp",
  description: "BizCar là mô hình quản trị. BMDO và MBM là chương trình. 3W là chuẩn thành công. B2A, BABOSO, KORA, KLASS và MyBizCar bổ sung hệ sinh thái phương pháp.",
  path: "/mo-hinh-phuong-phap",
});

export default function MethodsIndexPage() {
  const list = publishedMethodologies();
  return (
    <>
      <PageHero
        title="Mô hình, chương trình và chuẩn thành công"
        description="Phân biệt rõ: BizCar = mô hình quản trị. BMDO = chương trình đào tạo CEO thực chiến. MBM = chương trình làm chủ mô hình. 3W = chuẩn thành công WOW–WELL–WIN."
        crumbs={[{ name: "Trang chủ", href: "/" }, { name: "Mô hình & phương pháp" }]}
      />
      <Container className="py-10">
        <p className="max-w-3xl text-vabix-muted">{threeW.headline}</p>
        <Link href="/mo-hinh-phuong-phap/3w" className="mt-3 inline-block font-semibold text-vabix-deep-teal">
          Xem chuẩn 3W
        </Link>
      </Container>
      <Container className="grid gap-4 pb-16 md:grid-cols-2">
        {list.map((m) => (
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

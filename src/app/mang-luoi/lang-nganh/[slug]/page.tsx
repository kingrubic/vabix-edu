import { notFound } from "next/navigation";
import { villages } from "@/content/network";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Section";
import { CTASection } from "@/components/sections/CTASection";
import { createMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return villages.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const v = villages.find((x) => x.slug === slug);
  if (!v) return {};
  return createMetadata({ title: v.name, description: v.summary, path: `/mang-luoi/lang-nganh/${v.slug}` });
}

export default async function VillagePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const v = villages.find((x) => x.slug === slug);
  if (!v) notFound();
  return (
    <>
      <PageHero
        title={v.name}
        description={v.summary}
        crumbs={[
          { name: "Trang chủ", href: "/" },
          { name: "Làng ngành", href: "/mang-luoi/lang-nganh" },
          { name: v.name },
        ]}
      />
      <Container className="py-16">
        <p className="measure text-vabix-muted">
          Làng {v.name} tập hợp các nhà cung cấp và chuyên gia phù hợp, được VABIX thẩm định trước khi kết nối với cư dân và khách hàng. Để tham gia với tư cách nhà cung cấp, vui lòng xem lộ trình trở thành đối tác.
        </p>
      </Container>
      <CTASection title="Kết nối trong làng ngành" description="Gửi nhu cầu kết nối hoặc hồ sơ nhà cung cấp." />
    </>
  );
}

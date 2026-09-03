import { notFound } from "next/navigation";
import { supportServices } from "@/content/network";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Section";
import { LeadForm } from "@/components/forms/LeadForm";
import { createMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return supportServices.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = supportServices.find((x) => x.slug === slug);
  if (!s) return {};
  return createMetadata({ title: s.title, description: s.summary, path: `/dich-vu-phu-tro/${s.slug}` });
}

export default async function SupportServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = supportServices.find((x) => x.slug === slug);
  if (!s) notFound();
  return (
    <>
      <PageHero
        title={s.title}
        description={s.summary}
        crumbs={[{ name: "Trang chủ", href: "/" }, { name: s.title }]}
      />
      <Container className="grid gap-10 py-16 lg:grid-cols-2">
        <p className="measure text-vabix-muted">
          Đây là dịch vụ phụ trợ trong hệ sinh thái VABIX, được giữ lại từ website hiện hữu và đặt trong luồng kết nối doanh nghiệp.
        </p>
        <div className="border border-vabix-deep-teal/10 p-6">
          <LeadForm type="consult" title="Đăng ký dịch vụ" />
        </div>
      </Container>
    </>
  );
}

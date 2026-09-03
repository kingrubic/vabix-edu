import { notFound } from "next/navigation";
import { books } from "@/content/network";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Section";
import { CTASection } from "@/components/sections/CTASection";
import { createMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return books.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const b = books.find((x) => x.slug === slug);
  if (!b) return {};
  return createMetadata({ title: b.title, description: b.summary, path: `/tri-thuc/sach/${b.slug}` });
}

export default async function BookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const b = books.find((x) => x.slug === slug);
  if (!b) notFound();
  return (
    <>
      <PageHero title={b.title} description={b.summary} crumbs={[{ name: "Trang chủ", href: "/" }, { name: "Sách", href: "/tri-thuc/sach" }, { name: b.title }]} />
      <Container className="py-16">
        <p className="measure text-vabix-muted">
          Ấn phẩm thuộc hệ thống tri thức VABIX. Để đặt sách, mời hợp tác xuất bản hoặc chương trình hỗ trợ doanh nhân viết sách, vui lòng liên hệ.
        </p>
      </Container>
      <CTASection title="Hỗ trợ doanh nhân Việt viết sách" description="VABIX đồng hành biến tri thức thực chiến thành ấn phẩm." primary={{ label: "Liên hệ xuất bản", href: "/dich-vu-phu-tro/ho-tro-doanh-nhan-viet-sach" }} />
    </>
  );
}

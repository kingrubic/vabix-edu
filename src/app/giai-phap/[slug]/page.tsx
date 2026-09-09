import { notFound } from "next/navigation";
import { getSolution, solutions } from "@/content/solutions";
import { SolutionTemplate } from "@/components/templates/SolutionTemplate";
import { createMetadata } from "@/lib/seo";

/** Old solution URLs are 301-redirected. This page remains only as a safety net. */
export function generateStaticParams() {
  return solutions
    .filter((s) => !["tu-van-chien-luoc", "dao-tao-doanh-nhan", "huan-luyen-doanh-nghiep", "thiet-ke-van-hanh-doanh-nghiep", "ket-noi-doanh-nghiep", "xuc-tien-thuong-mai"].includes(s.slug))
    .map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = getSolution(slug);
  if (!s) return {};
  return createMetadata({ title: s.title, description: s.summary, path: `/giai-phap/${s.slug}` });
}

export default async function SolutionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = getSolution(slug);
  if (!s) notFound();
  return <SolutionTemplate solution={s} />;
}

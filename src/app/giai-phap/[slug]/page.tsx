import { notFound } from "next/navigation";
import { solutions, getSolution } from "@/content/solutions";
import { publishedSolution, publishedSolutions } from "@/platform/cms/catalog";
import { SolutionTemplate } from "@/components/templates/SolutionTemplate";
import { createMetadata } from "@/lib/seo";

/** Old solution URLs are 301-redirected. This page remains only as a safety net. */
export function generateStaticParams() {
  const blocked = ["tu-van-chien-luoc", "dao-tao-doanh-nhan", "huan-luyen-doanh-nghiep", "thiet-ke-van-hanh-doanh-nghiep", "ket-noi-doanh-nghiep", "xuc-tien-thuong-mai"];
  const slugs = new Set(solutions.filter((s) => !blocked.includes(s.slug)).map((s) => s.slug));
  try {
    for (const item of publishedSolutions()) {
      if (!blocked.includes(item.slug)) slugs.add(item.slug);
    }
  } catch {
    /* file fallback */
  }
  return [...slugs].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = publishedSolution(slug) ?? getSolution(slug);
  if (!s) return {};
  return createMetadata({ title: s.title, description: s.summary, path: `/giai-phap/${s.slug}` });
}

export default async function SolutionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = publishedSolution(slug) ?? getSolution(slug);
  if (!s) notFound();
  return <SolutionTemplate solution={s} />;
}

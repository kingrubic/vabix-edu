import { programs } from "@/content/programs";
import { methodologies } from "@/content/methodologies";
import { experts } from "@/content/experts";
import { articles } from "@/content/articles";
import { caseStudies } from "@/content/caseStudies";
import { events } from "@/content/events";
import { knowledgeProducts } from "@/content/knowledgeProducts";
import { solutions } from "@/content/solutions";
import { getCms, listPublishedCms, publicPayload } from "./service";
import { pickAllowlisted } from "@/platform/permissions/registry";
import type { ArticleCategory, TrainingProgram as Program } from "@/content/types";

function overlayList<T extends { slug: string }>(type: string, files: T[]): T[] {
  try {
    const docs = listPublishedCms(type);
    const published = new Map(docs.map((doc) => [doc.slug, publicPayload<T>(doc)]));
    const taken = new Set<string>();
    const merged: T[] = [];
    for (const file of files) {
      const doc = getCms(type, file.slug);
      if (doc) {
        if (doc.status === "published") {
          merged.push({ ...file, ...published.get(file.slug) });
          taken.add(file.slug);
        }
        continue;
      }
      merged.push(file);
    }
    for (const doc of docs) {
      if (!taken.has(doc.slug) && !files.some((file) => file.slug === doc.slug)) {
        merged.push(publicPayload<T>(doc));
      }
    }
    return merged;
  } catch {
    return files;
  }
}

export function publishedPrograms(): Program[] {
  const files = programs.filter((item) => item.status === "published");
  return overlayList("program", files).filter((item) => item.status !== "draft");
}

export function publishedProgram(slug: string) {
  return publishedPrograms().find((item) => item.slug === slug) ?? null;
}

export function publishedFeaturedPrograms() {
  return publishedPrograms().filter((item) => item.featured);
}

export function publishedMethodologies() {
  return overlayList("methodology", methodologies);
}

export function publishedMethodology(slug: string) {
  return publishedMethodologies().find((item) => item.slug === slug) ?? null;
}

export function publishedExperts() {
  return overlayList("expert", experts);
}

export function publishedExpert(slug: string) {
  return publishedExperts().find((item) => item.slug === slug) ?? null;
}

export function publishedFeaturedExperts() {
  return publishedExperts()
    .filter((item) => item.featured)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export function publishedArticles() {
  return overlayList("article", articles);
}

export function publishedArticle(slug: string) {
  return publishedArticles().find((item) => item.slug === slug) ?? null;
}

export function publishedArticlesByCategory(category?: ArticleCategory) {
  const list = [...publishedArticles()].sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));
  return category ? list.filter((item) => item.category === category) : list;
}

export function publishedCaseStudies() {
  return overlayList("case_study", caseStudies);
}

export function publishedCaseStudy(slug: string) {
  return publishedCaseStudies().find((item) => item.slug === slug) ?? null;
}

export function publishedEvents() {
  return overlayList("event", events);
}

export function publishedEvent(slug: string) {
  return publishedEvents().find((item) => item.slug === slug) ?? null;
}

export function publishedUpcomingEvents() {
  const rank: Record<string, number> = { upcoming: 0, ongoing: 1, completed: 2 };
  return [...publishedEvents()].sort((a, b) => {
    const ra = rank[a.status] ?? 9;
    const rb = rank[b.status] ?? 9;
    if (ra !== rb) return ra - rb;
    return (a.startDate ?? "").localeCompare(b.startDate ?? "");
  });
}

export function publishedKnowledgeProducts() {
  return overlayList("knowledge_product", knowledgeProducts);
}

export function publishedKnowledgeProduct(slug: string) {
  return publishedKnowledgeProducts().find((item) => item.slug === slug) ?? null;
}

export function publishedSolutions() {
  return overlayList("solution", solutions);
}

export function publishedSolution(slug: string) {
  return publishedSolutions().find((item) => item.slug === slug) ?? null;
}

export function publishedPage(slug: string) {
  try {
    const doc = getCms("page", slug);
    if (!doc || doc.status !== "published") return null;
    return publicPayload<Record<string, unknown>>(doc);
  } catch {
    return null;
  }
}

export function publicCmsRecord(type: string, slug: string) {
  const doc = getCms(type, slug);
  if (!doc || doc.status !== "published") return null;
  return pickAllowlisted(type, { ...publicPayload(doc), slug: doc.slug, title: doc.title });
}

export type { TrainingProgram } from "@/content/types";

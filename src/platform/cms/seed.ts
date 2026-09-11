import { getDb, nowIso, newId } from "@/platform/db/client";
import { programs } from "@/content/programs";
import { methodologies } from "@/content/methodologies";
import { experts } from "@/content/experts";
import { articles } from "@/content/articles";
import { caseStudies } from "@/content/caseStudies";
import { events } from "@/content/events";
import { knowledgeProducts } from "@/content/knowledgeProducts";
import { solutions } from "@/content/solutions";
import { consultingServices } from "@/content/consulting";
import { pillars } from "@/content/pillars";
import { partners, villages } from "@/content/network";
import { primaryNav } from "@/content/navigation";
import * as brand from "@/content/brand";
import * as about from "@/content/about";
import { siteConfig } from "@/lib/siteConfig";

function upsert(
  type: string,
  slug: string,
  title: string,
  payload: unknown,
  status: "published" | "draft" = "published",
  seo: unknown = {},
  featured = false,
) {
  const db = getDb();
  const at = nowIso();
  db.prepare(
    `INSERT OR IGNORE INTO cms_documents (id, type, slug, title, status, payload, seo, internal_notes, featured, sort_order, published_at, published_by, version, origin, is_seed, created_at, updated_at, created_by, updated_by, archived_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, '', ?, 0, ?, NULL, 1, 'file-seed', 1, ?, ?, NULL, NULL, NULL)`,
  ).run(newId(), type, slug, title, status, JSON.stringify(payload), JSON.stringify(seo), featured ? 1 : 0, status === "published" ? at : null, at, at);
}

export function seedCmsFromFiles() {
  upsert(
    "page",
    "home",
    "Trang chủ",
    {
      heroHeadline: brand.heroHeadline,
      heroSubheadline: brand.heroSubheadline,
      tagline: brand.tagline,
      supportingMessage: brand.supportingMessage,
    },
    "published",
    { title: "VABIX — Kết tri thức. Nối giá trị.", description: siteConfig.description },
  );
  upsert("page", "ve-vabix", "Về VABIX", {
    mission: brand.mission,
    aspiration2031: brand.aspiration2031,
    journey: about.journey,
    painPoints: about.painPoints,
  });
  upsert("page", "giai-phap", "Giải pháp 3T", { pillars });
  upsert("nav", "primary", "Menu chính", { items: primaryNav });
  upsert("footer", "site", "Footer", {
    legalName: siteConfig.legalName,
    tagline: siteConfig.tagline,
    contact: siteConfig.contact,
    social: siteConfig.social,
  });
  upsert("policy", "chinh-sach-bao-mat", "Chính sách bảo mật", { path: "/chinh-sach-bao-mat" });
  upsert("policy", "dieu-khoan", "Điều khoản", { path: "/dieu-khoan" });
  upsert("workforce", "nhan-luc", "Nhân lực mở & nhân lực số", { path: "/nhan-luc-mo-nhan-luc-so" });

  for (const item of programs) {
    upsert(
      "program",
      item.slug,
      item.title,
      item,
      item.status === "published" ? "published" : "draft",
      { title: item.title, description: item.seoDescription },
      Boolean(item.featured),
    );
  }
  for (const item of methodologies) {
    upsert("methodology", item.slug, item.name, item);
  }
  for (const item of experts) {
    upsert("expert", item.slug, item.name, item, "published", {}, Boolean(item.featured));
  }
  for (const item of articles) {
    upsert("article", item.slug, item.title, item, "published", { title: item.title, description: item.excerpt }, Boolean(item.featured));
  }
  for (const item of caseStudies) {
    upsert("case_study", item.slug, item.organization, item, "published", {}, Boolean(item.featured));
  }
  for (const item of events) {
    upsert("event", item.slug, item.title, item, "published", {}, Boolean(item.featured));
  }
  for (const item of knowledgeProducts) {
    upsert("knowledge_product", item.slug, item.title, item, item.status === "published" ? "published" : "draft");
  }
  for (const item of solutions) {
    upsert("solution", item.slug, item.title, item);
  }
  for (const item of consultingServices) {
    upsert("solution", item.slug, item.title, { ...item, pillar: "tu-van-chuyen-doi" });
  }
  for (const item of partners) {
    upsert("partner", item.id, item.name, item);
  }
  for (const item of villages) {
    upsert("village", item.slug, item.name, item);
  }
}

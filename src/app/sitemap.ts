import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/siteConfig";
import { consultingServices } from "@/content/consulting";
import { programs } from "@/content/programs";
import { methodologies } from "@/content/methodologies";
import { experts } from "@/content/experts";
import { articles } from "@/content/articles";
import { caseStudies } from "@/content/caseStudies";
import { events } from "@/content/events";
import { handbooks, books, villages, collections, supportServices } from "@/content/network";
import { knowledgeProducts } from "@/content/knowledgeProducts";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPaths = [
    "/",
    "/ve-vabix",
    "/giai-phap",
    "/giai-phap/dao-tao-huan-luyen",
    "/giai-phap/tu-van-chuyen-doi",
    "/giai-phap/trustworking",
    "/chuong-trinh",
    "/mo-hinh-phuong-phap",
    "/san-pham-tri-thuc",
    "/nhan-luc-mo-nhan-luc-so",
    "/mang-luoi",
    "/mang-luoi/chuyen-gia",
    "/mang-luoi/doi-tac",
    "/mang-luoi/lang-nganh",
    "/mang-luoi/nha-cung-cap",
    "/mang-luoi/tro-thanh-doi-tac",
    "/tri-thuc",
    "/tri-thuc/case-study",
    "/tri-thuc/cam-nang",
    "/tri-thuc/sach",
    "/su-kien",
    "/su-kien/archive",
    "/lien-he",
    "/ket-noi",
    "/cong-cu-dan",
    "/bo-suu-tap",
    "/chinh-sach-quyen-rieng-tu",
    "/chinh-sach-bao-mat",
    "/dieu-khoan",
    "/khuyen-cao",
  ];
  const extra = [
    ...consultingServices.map((s) => `/giai-phap/tu-van-chuyen-doi/${s.slug}`),
    ...programs.filter((p) => p.status === "published").map((p) => `/chuong-trinh/${p.slug}`),
    ...methodologies.map((m) => `/mo-hinh-phuong-phap/${m.slug}`),
    ...knowledgeProducts.map((p) => `/san-pham-tri-thuc/${p.slug}`),
    ...experts.map((e) => `/mang-luoi/chuyen-gia/${e.slug}`),
    ...articles.map((a) => `/tri-thuc/${a.slug}`),
    ...caseStudies.map((c) => `/tri-thuc/case-study/${c.slug}`),
    ...events.map((e) => `/su-kien/${e.slug}`),
    ...handbooks.map((h) => `/tri-thuc/cam-nang/${h.slug}`),
    ...books.map((b) => `/tri-thuc/sach/${b.slug}`),
    ...villages.map((v) => `/mang-luoi/lang-nganh/${v.slug}`),
    ...collections.map((c) => `/bo-suu-tap/${c.slug}`),
    ...supportServices.map((s) => `/dich-vu-phu-tro/${s.slug}`),
  ];
  return [...staticPaths, ...extra].map((path) => ({
    url: `${siteConfig.website}${path === "/" ? "" : path}`,
    lastModified: now,
  }));
}

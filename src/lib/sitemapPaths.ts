import { consultingServices } from "../content/consulting";
import { programs } from "../content/programs";
import { methodologies } from "../content/methodologies";
import { experts } from "../content/experts";
import { articles } from "../content/articles";
import { caseStudies } from "../content/caseStudies";
import { events } from "../content/events";
import { handbooks, books, villages, collections, supportServices } from "../content/network";
import {
  knowledgeProductCanonicalPath,
  knowledgeProducts,
} from "../content/knowledgeProducts";

const staticPaths = [
  "/",
  "/ve-vabix",
  "/dao-tao",
  "/dao-tao/lich",
  "/tu-van-chuyen-doi",
  "/trustworking",
  "/giai-phap",
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
  "/goc-chia-se",
  "/sach",
  "/cam-nang",
  "/tim-kiem",
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

export function sitemapPaths(): string[] {
  const paths = [
    ...staticPaths,
    ...consultingServices.map((s) => `/tu-van-chuyen-doi/${s.slug}`),
    ...programs.filter((p) => p.status === "published").map((p) => `/dao-tao/${p.slug}`),
    ...methodologies.map((m) => `/mo-hinh-phuong-phap/${m.slug}`),
    ...knowledgeProducts
      .filter((p) => p.status === "published")
      .map((p) => knowledgeProductCanonicalPath(p))
      .filter((path) => path.startsWith("/san-pham-tri-thuc/")),
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
  return [...new Set(paths)];
}

export function duplicatePaths(paths: string[]): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const path of paths) {
    if (seen.has(path)) duplicates.add(path);
    else seen.add(path);
  }
  return [...duplicates];
}

/** Canonical public paths. Old indexed URLs stay via 301 in `src/content/redirects.ts`. */

export const paths = {
  home: "/",
  about: "/ve-vabix",
  training: "/dao-tao",
  program: (slug: string) => `/dao-tao/${slug}`,
  programSchedule: "/dao-tao/lich",
  consulting: "/tu-van-chuyen-doi",
  consultingService: (slug: string) => `/tu-van-chuyen-doi/${slug}`,
  trustworking: "/trustworking",
  methods: "/mo-hinh-phuong-phap",
  method: (slug: string) => `/mo-hinh-phuong-phap/${slug}`,
  knowledge: "/tri-thuc",
  books: "/sach",
  handbooks: "/cam-nang",
  insights: "/goc-chia-se",
  article: (slug: string) => `/tri-thuc/${slug}`,
  caseStudies: "/tri-thuc/case-study",
  events: "/su-kien",
  experts: "/mang-luoi/chuyen-gia",
  contact: "/lien-he",
  consult: "/ket-noi#tu-van",
  learnerPortal: "/hoc-tap",
  login: "/dang-nhap",
  search: "/tim-kiem",
  privacy: "/chinh-sach-quyen-rieng-tu",
} as const;

export const homepageFeaturedSlugs = [
  "bmdo",
  "quan-tri-chien-luoc-digai",
  "thao-truong-khoi-nghiep",
  "lanh-dao-tinh-thuc",
] as const;

export const ecosystemMethodSlugs = [
  "bizcar",
  "applier",
  "mais",
  "3w",
  "karot",
  "klass",
  "baboso",
  "dgh",
] as const;

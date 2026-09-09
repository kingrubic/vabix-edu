export type FaqItem = {
  question: string;
  answer: string;
};

export type Expert = {
  id: string;
  slug: string;
  name: string;
  title: string;
  organizationRole: string;
  expertise: string[];
  shortBio: string;
  fullBio: string;
  portrait: string;
  linkedin?: string;
  featured: boolean;
  order: number;
  programs: string[];
  caseStudies: string[];
  articles: string[];
};

export type ArticleCategory =
  | "insights"
  | "chien-luoc"
  | "quan-tri"
  | "bizcar"
  | "marketing"
  | "sales"
  | "lanh-dao"
  | "ai-chuyen-doi"
  | "case-study"
  | "hoat-dong";

export type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: ArticleCategory;
  categoryLabel: string;
  coverImage: string;
  author: string;
  publishedAt: string;
  featured: boolean;
  legacyPaths?: string[];
};

export type CaseStudy = {
  id: string;
  slug: string;
  organization: string;
  industry: string;
  challenge: string;
  solution: string;
  methodologies: string[];
  implementation: string;
  results: string;
  quote?: { text: string; author: string; role: string };
  coverImage: string;
  gallery: string[];
  relatedExperts: string[];
  context: string;
  lesson: string;
  featured: boolean;
};

export type EventStatus = "upcoming" | "ongoing" | "completed";

export type EventItem = {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  image: string;
  startDate: string;
  endDate?: string;
  location: string;
  registrationUrl?: string;
  status: EventStatus;
  featured: boolean;
};

export type Methodology = {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  eyebrow: string;
  headline: string;
  summary: string;
  description: string;
  whoFor: string[];
  outcomes: string[];
  process: { step: string; title: string; body: string }[];
  related: string[];
};

export type Solution = {
  id: string;
  slug: string;
  pillar: "tri-thuc" | "kinh-doanh";
  number: string;
  title: string;
  shortTitle: string;
  summary: string;
  whoFor: string[];
  painPoints: string[];
  outcomes: string[];
  scope: string[];
  process: { step: string; title: string; body: string }[];
  deliverables: string[];
  methodologies: string[];
  faqs: FaqItem[];
};

export type Partner = {
  id: string;
  name: string;
  caption: string;
  group: "enterprise" | "partner" | "sme";
};

export type Program = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  audience: string;
};

export type Testimonial = {
  id: string;
  quote: string;
  author: string;
  role: string;
};

export type Handbook = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  legacyPath: string;
};

export type Book = {
  id: string;
  slug: string;
  title: string;
  summary: string;
};

export type Village = {
  id: string;
  slug: string;
  name: string;
  summary: string;
};

export type Metric = {
  id: string;
  value: string;
  label: string;
};

export type PillarId = "dao-tao-huan-luyen" | "tu-van-chuyen-doi" | "trustworking";

export type Pillar = {
  id: PillarId;
  number: string;
  en: string;
  vi: string;
  href: string;
  problem: string;
  value: string;
  summary: string;
  services: { label: string; href: string }[];
  cta: { label: string; href: string };
};

export type ProgramGroupId = "ceo" | "management" | "custom";

export type TopicCategoryId =
  | "lanh-dao-quan-tri"
  | "chien-luoc-mo-hinh"
  | "to-chuc-van-hanh"
  | "con-nguoi-van-hoa"
  | "thi-truong-khach-hang"
  | "tai-chinh"
  | "cong-nghe-ai";

export type TrainingProgram = {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  englishName?: string;
  group: ProgramGroupId;
  audience: string;
  audienceList: string[];
  problem: string;
  objectives: string[];
  topics: string[];
  topicCategories: TopicCategoryId[];
  methodology: string;
  deliverables: string[];
  outcomes: string[];
  duration?: string;
  durationNote?: string;
  format?: string;
  certificate?: string;
  faculty?: string[];
  status: "published" | "draft";
  featured: boolean;
  relatedPrograms: string[];
  relatedModels: string[];
  seoDescription: string;
};

export type TrainingGroup = {
  id: string;
  number: string;
  title: string;
  audience: string;
  goal: string;
  topics: string[];
  outcomes: string[];
};

export type ConsultingService = {
  id: string;
  slug: string;
  number: string;
  title: string;
  summary: string;
  scope: string[];
  deliverables: string[];
  outcomes: string[];
};

export type KnowledgeProduct = {
  id: string;
  slug: string;
  category: "sach" | "cam-nang" | "bieu-mau" | "hoc-lieu";
  title: string;
  summary: string;
  status: "published" | "coming";
  href?: string;
};

export type CoreValue = {
  title: string;
  body: string;
};

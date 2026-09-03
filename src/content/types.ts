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

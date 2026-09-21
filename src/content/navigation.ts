export type NavChild = {
  label: string;
  href: string;
  description?: string;
};

export type NavGroup = {
  label: string;
  href?: string;
  children: NavChild[];
};

export type NavEcosystem = {
  title: string;
  items: { label: string; href: string }[];
  cta: { label: string; href: string };
  note?: string;
};

export type NavItem = {
  label: string;
  /** Compact label for the desktop header; full `label` stays in menus and footer. */
  shortLabel?: string;
  href: string;
  variant?: "link" | "dropdown" | "mega";
  groups?: NavGroup[];
  children?: NavChild[];
  ecosystem?: NavEcosystem;
  activeMatch?: string[];
  excludeMatch?: string[];
};

export function isNavItemActive(item: NavItem, pathname: string | null) {
  if (!pathname) return false;
  if (item.excludeMatch?.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return false;
  }
  const prefixes = item.activeMatch ?? [item.href.split("#")[0] ?? item.href];
  return prefixes.some((raw) => {
    const p = raw.split("#")[0] ?? raw;
    if (!p) return false;
    return pathname === p || pathname.startsWith(`${p}/`);
  });
}

export const primaryNav: NavItem[] = [
  {
    label: "Về VABIX",
    href: "/ve-vabix",
    variant: "dropdown",
    activeMatch: ["/ve-vabix", "/mo-hinh-phuong-phap", "/mang-luoi/chuyen-gia", "/lien-he"],
    children: [
      { label: "Giới thiệu VABIX", href: "/ve-vabix", description: "Hệ sinh thái tri thức thực chiến và phát triển doanh nghiệp." },
      { label: "Tầm nhìn & Sứ mệnh", href: "/ve-vabix#su-menh", description: "Chuyển hóa tri thức thành khả lực hành động." },
      { label: "Mô hình / Phương pháp", href: "/mo-hinh-phuong-phap", description: "BizCar, APPLIER, MAIS và các khung thực chiến." },
      { label: "Đội ngũ", href: "/mang-luoi/chuyen-gia", description: "Chuyên gia đồng hành đào tạo, tư vấn và kết nối." },
      { label: "Liên hệ", href: "/lien-he", description: "Kết nối với văn phòng và đội ngũ VABIX." },
    ],
  },
  {
    label: "Giải pháp",
    href: "/giai-phap",
    variant: "mega",
    activeMatch: ["/giai-phap", "/tu-van-chuyen-doi", "/trustworking"],
    children: [
      {
        label: "Tư vấn chuyển đổi",
        href: "/tu-van-chuyen-doi",
        description: "Đồng hành doanh nghiệp từ chiến lược đến triển khai.",
      },
      {
        label: "Đào tạo doanh nghiệp",
        href: "/dao-tao",
        description: "Phát triển năng lực đội ngũ gắn với bài toán thực tiễn.",
      },
      {
        label: "Coaching lãnh đạo",
        href: "/dao-tao#coaching",
        description: "Đồng hành cùng lãnh đạo trong phát triển năng lực quản trị.",
      },
      {
        label: "Trustworking",
        href: "/trustworking",
        description: "Kiến tạo kết nối kinh doanh dựa trên niềm tin và giá trị tương hỗ.",
      },
      {
        label: "Thiết kế chương trình theo yêu cầu",
        href: "/dao-tao/theo-yeu-cau-doanh-nghiep",
        description: "Xây dựng chương trình riêng theo nhu cầu và bối cảnh doanh nghiệp.",
      },
    ],
    ecosystem: {
      title: "Hệ sinh thái 3T",
      note: "Giải pháp phát triển doanh nghiệp theo hệ sinh thái 3T",
      items: [
        { label: "Training & Coaching", href: "/dao-tao" },
        { label: "Transformation", href: "/tu-van-chuyen-doi" },
        { label: "Trustworking", href: "/trustworking" },
      ],
      cta: { label: "Khám phá hệ sinh thái", href: "/giai-phap" },
    },
  },
  {
    label: "Đào tạo",
    href: "/dao-tao",
    variant: "dropdown",
    activeMatch: ["/dao-tao"],
    groups: [
      {
        label: "Chương trình",
        children: [
          { label: "Đào tạo doanh nghiệp", href: "/dao-tao", description: "Tổng quan Training & Coaching thực chiến." },
          { label: "Chương trình dành cho lãnh đạo", href: "/dao-tao#doanh-chu", description: "BMDO, MBM và thao trường doanh chủ." },
          { label: "Quản lý & đội ngũ", href: "/dao-tao#quan-ly", description: "Năng lực quản lý, bán hàng, vận hành và AI." },
          { label: "Đào tạo theo yêu cầu", href: "/dao-tao/theo-yeu-cau-doanh-nghiep", description: "Thiết kế sau khảo sát hiện trạng." },
        ],
      },
      {
        label: "Đang tuyển sinh",
        children: [
          { label: "Lịch học / lớp đang mở", href: "/dao-tao/lich", description: "Các lớp và lịch đào tạo hiện có." },
          { label: "BMDO", href: "/dao-tao/bmdo", description: "Thao trường thiết kế và vận hành doanh nghiệp toàn diện." },
          { label: "MBM", href: "/dao-tao/mbm", description: "Mastery of the BizCar Model — chương trình chuyên sâu." },
        ],
      },
    ],
  },
  {
    label: "Dự án",
    href: "/tri-thuc/case-study",
    variant: "link",
    activeMatch: ["/tri-thuc/case-study"],
  },
  {
    label: "Tri thức",
    href: "/tri-thuc",
    variant: "dropdown",
    activeMatch: ["/tri-thuc", "/goc-chia-se", "/sach", "/cam-nang"],
    excludeMatch: ["/tri-thuc/case-study"],
    children: [
      { label: "Góc nhìn", href: "/goc-chia-se?chuyen-muc=insights", description: "Insights và góc nhìn chuyên môn của VABIX." },
      { label: "Bài viết", href: "/goc-chia-se", description: "Góc chia sẻ — bài viết, chuyên đề và hoạt động." },
      { label: "Sách & Tri thức", href: "/tri-thuc", description: "Sách, cẩm nang, học liệu và hệ sinh thái tri thức." },
    ],
  },
  {
    label: "Sự kiện",
    href: "/su-kien",
    variant: "link",
    activeMatch: ["/su-kien"],
  },
];

function navItem(label: string) {
  const item = primaryNav.find((entry) => entry.label === label);
  if (!item) throw new Error(`Missing nav item: ${label}`);
  return item;
}

function childLinks(item: NavItem): { label: string; href: string }[] {
  if (item.groups?.length) {
    return item.groups.flatMap((group) => group.children.map(({ label, href }) => ({ label, href })));
  }
  return (item.children ?? []).map(({ label, href }) => ({ label, href }));
}

/** Footer columns stay aligned with `primaryNav` — same labels and real routes. */
export const footerColumns: { title: string; href: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Về VABIX",
    href: navItem("Về VABIX").href,
    links: childLinks(navItem("Về VABIX")),
  },
  {
    title: "Giải pháp",
    href: navItem("Giải pháp").href,
    links: childLinks(navItem("Giải pháp")),
  },
  {
    title: "Đào tạo",
    href: navItem("Đào tạo").href,
    links: [
      { label: "Tổng quan đào tạo", href: "/dao-tao" },
      { label: "Chương trình lãnh đạo", href: "/dao-tao#doanh-chu" },
      { label: "Đào tạo theo yêu cầu", href: "/dao-tao/theo-yeu-cau-doanh-nghiep" },
      { label: "BMDO", href: "/dao-tao/bmdo" },
      { label: "MBM", href: "/dao-tao/mbm" },
      { label: "Lịch học / lớp đang mở", href: "/dao-tao/lich" },
    ],
  },
  {
    title: "Tri thức",
    href: navItem("Tri thức").href,
    links: [
      ...childLinks(navItem("Tri thức")),
      { label: "Dự án", href: navItem("Dự án").href },
      { label: "Sự kiện", href: navItem("Sự kiện").href },
    ],
  },
];

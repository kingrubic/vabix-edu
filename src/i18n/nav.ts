import { footerColumns, primaryNav, type NavItem } from "@/content/navigation";
import { withLocale, type Locale } from "./locale";

const en: Record<string, string> = {
  "Về VABIX": "About",
  "Giới thiệu VABIX": "About VABIX",
  "Hệ sinh thái tri thức thực chiến và phát triển doanh nghiệp.": "A practical knowledge ecosystem for growing businesses.",
  "Tầm nhìn & Sứ mệnh": "Vision & mission",
  "Chuyển hóa tri thức thành khả lực hành động.": "Turning knowledge into the capacity to act.",
  "Mô hình / Phương pháp": "Models & methods",
  "BizCar, APPLIER, MAIS và các khung thực chiến.": "BizCar, APPLIER, MAIS and practical frameworks.",
  "Đội ngũ": "People",
  "Chuyên gia đồng hành đào tạo, tư vấn và kết nối.": "Experts for training, consulting and connections.",
  "Liên hệ": "Contact",
  "Kết nối với văn phòng và đội ngũ VABIX.": "Reach the VABIX office and team.",
  "Giải pháp": "Solutions",
  "Tư vấn chuyển đổi": "Transformation consulting",
  "Đồng hành doanh nghiệp từ chiến lược đến triển khai.": "From strategy through implementation.",
  "Đào tạo doanh nghiệp": "Corporate training",
  "Phát triển năng lực đội ngũ gắn với bài toán thực tiễn.": "Build team capability around real business problems.",
  "Coaching lãnh đạo": "Leadership coaching",
  "Đồng hành cùng lãnh đạo trong phát triển năng lực quản trị.": "Coaching leaders as they grow their management capability.",
  "Kiến tạo kết nối kinh doanh dựa trên niềm tin và giá trị tương hỗ.": "Business connections built on trust and shared value.",
  "Thiết kế chương trình theo yêu cầu": "Custom programs",
  "Xây dựng chương trình riêng theo nhu cầu và bối cảnh doanh nghiệp.": "Programs designed for a company's context and needs.",
  "Hệ sinh thái 3T": "The 3T ecosystem",
  "Giải pháp phát triển doanh nghiệp theo hệ sinh thái 3T": "Business growth through the 3T ecosystem",
  "Khám phá hệ sinh thái": "Explore the ecosystem",
  "Đào tạo": "Training",
  "Chương trình": "Programs",
  "Tổng quan Training & Coaching thực chiến.": "An overview of practical training and coaching.",
  "Chương trình dành cho lãnh đạo": "Programs for leaders",
  "BMDO, MBM và thao trường doanh chủ.": "BMDO, MBM and the business owner's practice field.",
  "Quản lý & đội ngũ": "Managers & teams",
  "Năng lực quản lý, bán hàng, vận hành và AI.": "Management, sales, operations and AI capability.",
  "Đào tạo theo yêu cầu": "Custom training",
  "Thiết kế sau khảo sát hiện trạng.": "Designed after a review of the current state.",
  "Đang tuyển sinh": "Now enrolling",
  "Lịch học / lớp đang mở": "Schedule / open classes",
  "Các lớp và lịch đào tạo hiện có.": "Current classes and training dates.",
  "Thao trường thiết kế và vận hành doanh nghiệp toàn diện.": "A practice field for designing and running the whole business.",
  "Mastery of the BizCar Model — chương trình chuyên sâu.": "Mastery of the BizCar Model — an in-depth program.",
  "Dự án": "Projects",
  "Tri thức": "Knowledge",
  "Góc nhìn": "Perspectives",
  "Insights và góc nhìn chuyên môn của VABIX.": "VABIX insights and professional perspectives.",
  "Bài viết": "Articles",
  "Góc chia sẻ — bài viết, chuyên đề và hoạt động.": "Essays, briefs and field notes.",
  "Sách & Tri thức": "Books & knowledge",
  "Sách, cẩm nang, học liệu và hệ sinh thái tri thức.": "Books, handbooks, learning materials and the knowledge ecosystem.",
  "Sự kiện": "Events",
  "Tổng quan đào tạo": "Training overview",
  "Chương trình lãnh đạo": "Leadership programs",
};

function label(value: string, locale: Locale) {
  if (locale === "vi") return value;
  return en[value] ?? value;
}

function localizeItem(item: NavItem, locale: Locale): NavItem {
  return {
    ...item,
    label: label(item.label, locale),
    href: withLocale(item.href, locale),
    activeMatch: item.activeMatch,
    children: item.children?.map((child) => ({
      ...child,
      label: label(child.label, locale),
      description: child.description ? label(child.description, locale) : undefined,
      href: withLocale(child.href, locale),
    })),
    groups: item.groups?.map((group) => ({
      ...group,
      label: label(group.label, locale),
      children: group.children.map((child) => ({
        ...child,
        label: label(child.label, locale),
        description: child.description ? label(child.description, locale) : undefined,
        href: withLocale(child.href, locale),
      })),
    })),
    ecosystem: item.ecosystem
      ? {
          ...item.ecosystem,
          title: label(item.ecosystem.title, locale),
          note: item.ecosystem.note ? label(item.ecosystem.note, locale) : undefined,
          items: item.ecosystem.items.map((entry) => ({ ...entry, href: withLocale(entry.href, locale) })),
          cta: { label: label(item.ecosystem.cta.label, locale), href: withLocale(item.ecosystem.cta.href, locale) },
        }
      : undefined,
  };
}

export function navFor(locale: Locale) {
  return primaryNav.map((item) => localizeItem(item, locale));
}

export function footerFor(locale: Locale) {
  return footerColumns.map((column) => ({
    ...column,
    title: label(column.title, locale),
    href: withLocale(column.href, locale),
    links: column.links.map((link) => ({ label: label(link.label, locale), href: withLocale(link.href, locale) })),
  }));
}

export function chrome(locale: Locale) {
  if (locale === "en") {
    return {
      home: "VABIX — home",
      search: "Search",
      learner: "Learner portal",
      register: "Request a conversation",
      menuOpen: "Open menu",
      menuClose: "Close menu",
      mobileMenu: "Mobile menu",
      skip: "Skip to content",
      contact: "Contact",
      privacy: "Privacy",
      terms: "Terms",
      security: "Security",
      notice: "Notice",
      founderRole: "Founder of VABIX",
      tagline: "Connect knowledge. Create value.",
    };
  }
  return {
    home: "VABIX — trang chủ",
    search: "Tìm kiếm",
    learner: "Cổng học viên",
    register: "Đăng ký tư vấn",
    menuOpen: "Mở menu",
    menuClose: "Đóng menu",
    mobileMenu: "Menu di động",
    skip: "Bỏ qua điều hướng",
    contact: "Liên hệ",
    privacy: "Quyền riêng tư",
    terms: "Điều khoản",
    security: "Bảo mật",
    notice: "Khuyến cáo",
    founderRole: "Nhà sáng lập VABIX",
    tagline: "Kết tri thức. Nối giá trị.",
  };
}

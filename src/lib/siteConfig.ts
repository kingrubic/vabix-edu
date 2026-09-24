/**
 * Centralized VABIX site configuration.
 * All contact, social and portal URLs must be consumed from this file.
 *
 * Source of truth: Hồ sơ năng lực VABIX 2026 + định vị Founder 2026 + public site vabix.edu.vn.
 * Historical materials contain conflicting contact details; do not hardcode
 * phone/email/address in components.
 */
export const siteConfig = {
  siteName: "VABIX",
  legalName: "Công ty Cổ phần VABIX",
  tagline: "Kết tri thức. Nối giá trị.",
  positioning: "Hệ sinh thái tri thức thực chiến và phát triển doanh nghiệp",
  statement: "Kết tri thức. Nối giá trị.",
  description:
    "VABIX đồng hành cùng doanh chủ và đội ngũ trong phát triển năng lực, chuyển đổi doanh nghiệp và kiến tạo những mối quan hệ kinh doanh dựa trên niềm tin.",
  website: "https://vabix.edu.vn",
  marketplaceWebsite: "https://vabix.vn",
  locale: "vi_VN",
  language: "vi",
  foundedYear: 2025,
  taxId: "0318798694",
  founder: {
    name: "Nguyễn Chí Thành",
    role: "Nhà sáng lập VABIX · Chủ tịch HĐQT kiêm Tổng Giám đốc",
    email: "thanhvabix@gmail.com",
  },
  contact: {
    hotline: "0919 171 976",
    hotlineHref: "tel:+84919171976",
    officePhone: "028 3716 1616",
    officePhoneHref: "tel:+842837161616",
    consultationPhone: "0889 659 966",
    consultationPhoneHref: "tel:+84889659966",
    email: "info@vabix.vn",
    emailHref: "mailto:info@vabix.vn",
    supportEmail: "support@vabix.vn",
    supportEmailHref: "mailto:support@vabix.vn",
    address:
      "Tầng 2, Toà nhà Thanh Long, 456 Xô Viết Nghệ Tĩnh, Phường Thạnh Mỹ Tây, TP. Hồ Chí Minh",
    addressShort: "456 Xô Viết Nghệ Tĩnh, Phường Gia Định, TP. HCM",
    quickPhone: "0919 171 976",
    quickPhoneHref: "tel:0919171976",
    quickEmail: "thuyvabix@gmail.com",
    quickEmailHref: "mailto:thuyvabix@gmail.com",
  },
  social: {
    facebook: "https://www.facebook.com/VabixVietnam",
    facebookHandle: "fb.com/VabixVietnam",
    linkedin: "https://www.linkedin.com/company/vabix",
    youtube: "https://www.youtube.com/@VABIX",
    zalo: "https://zalo.me/vabix",
    zaloLabel: "VABIX Official",
    zaloChat: "https://zalo.me/0919171976",
  },
  portals: {
    resident: "https://smar.vabix.vn/",
    login: "https://vabix.vn/login-page",
    marketplace: "https://vabix.vn/career-web-group",
    bizcarEngine: "/bizcar/engine",
    bizcarHome: "/bizcar",
    bizcarHost: "https://bizcar.vabix.edu.vn",
    vabixHome: "/vabix",
  },
  cta: {
    primary: { label: "Trao đổi cùng VABIX", href: "/ket-noi#tu-van" },
    consult: { label: "Trao đổi cùng VABIX", href: "/ket-noi#tu-van" },
    explore: { label: "Khám phá hệ sinh thái VABIX", href: "/ve-vabix" },
    schedule: { label: "Đặt lịch trao đổi", href: "/ket-noi#tu-van" },
    contact: { label: "Liên hệ VABIX", href: "/lien-he" },
    learner: { label: "Cổng học viên", href: "/dang-nhap" },
    register: { label: "Đăng ký tư vấn", href: "/ket-noi#tu-van" },
  },
} as const;

export type SiteConfig = typeof siteConfig;

import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import { Container } from "@/components/ui/Section";
import { Logo } from "@/components/brand/Logo";

const cols = [
  {
    title: "Về VABIX",
    links: [
      { label: "Tầm nhìn", href: "/ve-vabix#tam-nhin" },
      { label: "Sứ mệnh", href: "/ve-vabix#su-menh" },
      { label: "Chuyên gia", href: "/mang-luoi/chuyen-gia" },
      { label: "Đối tác", href: "/mang-luoi/doi-tac" },
    ],
  },
  {
    title: "Giải pháp",
    links: [
      { label: "Tư vấn", href: "/giai-phap/tu-van-chien-luoc" },
      { label: "Đào tạo", href: "/giai-phap/dao-tao-doanh-nhan" },
      { label: "Huấn luyện", href: "/giai-phap/huan-luyen-doanh-nghiep" },
      { label: "Kết nối doanh nghiệp", href: "/giai-phap/ket-noi-doanh-nghiep" },
    ],
  },
  {
    title: "Tri thức",
    links: [
      { label: "Insights", href: "/tri-thuc" },
      { label: "Case Study", href: "/tri-thuc/case-study" },
      { label: "Sự kiện", href: "/su-kien" },
      { label: "Cẩm nang", href: "/tri-thuc/cam-nang" },
    ],
  },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-vabix-deep-teal text-white">
      <Container className="py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <Link href="/" aria-label="VABIX — trang chủ">
              <Logo variant="dark" className="h-11 sm:h-12" />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-white/75">{siteConfig.positioning}</p>
            <ul className="mt-5 flex gap-4 text-sm text-vabix-soft-gold">
              <li>
                <a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer">
                  Facebook
                </a>
              </li>
              <li>
                <a href={siteConfig.social.linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href={siteConfig.social.youtube} target="_blank" rel="noopener noreferrer">
                  YouTube
                </a>
              </li>
            </ul>
          </div>
          {cols.map((col) => (
            <div key={col.title}>
              <p className="eyebrow mb-4">{col.title}</p>
              <ul className="space-y-2 text-sm text-white/80">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:text-vabix-gold">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <p className="eyebrow mb-4">Liên hệ</p>
            <address className="space-y-2 text-sm not-italic text-white/80">
              <p>{siteConfig.contact.address}</p>
              <p>
                <a href={siteConfig.contact.hotlineHref} className="hover:text-vabix-gold">
                  {siteConfig.contact.hotline}
                </a>
              </p>
              <p>
                <a href={siteConfig.contact.emailHref} className="hover:text-vabix-gold">
                  {siteConfig.contact.email}
                </a>
              </p>
            </address>
          </div>
        </div>
      </Container>
      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-3 py-5 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.legalName}. {siteConfig.tagline}
          </p>
          <div className="flex gap-4">
            <Link href="/chinh-sach-quyen-rieng-tu" className="hover:text-white">
              Quyền riêng tư
            </Link>
            <Link href="/dieu-khoan" className="hover:text-white">
              Điều khoản
            </Link>
            <Link href="/chinh-sach-bao-mat" className="hover:text-white">
              Bảo mật
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}

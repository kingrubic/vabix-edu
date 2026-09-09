import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import { Container } from "@/components/ui/Section";
import { Logo } from "@/components/brand/Logo";

const cols = [
  {
    title: "Ba mũi nhọn",
    links: [
      { label: "Đào tạo & huấn luyện", href: "/giai-phap/dao-tao-huan-luyen" },
      { label: "Tư vấn chuyển đổi", href: "/giai-phap/tu-van-chuyen-doi" },
      { label: "Trustworking", href: "/giai-phap/trustworking" },
      { label: "Tổng quan 3T", href: "/giai-phap" },
    ],
  },
  {
    title: "Chương trình & mô hình",
    links: [
      { label: "Danh mục chương trình", href: "/chuong-trinh" },
      { label: "BMDO", href: "/chuong-trinh/bmdo" },
      { label: "MBM", href: "/chuong-trinh/mbm" },
      { label: "BizCar", href: "/mo-hinh-phuong-phap/bizcar" },
      { label: "3W", href: "/mo-hinh-phuong-phap/3w" },
    ],
  },
  {
    title: "Hệ sinh thái",
    links: [
      { label: "Sản phẩm tri thức", href: "/san-pham-tri-thuc" },
      { label: "Nhân lực mở & số", href: "/nhan-luc-mo-nhan-luc-so" },
      { label: "Chuyên gia", href: "/mang-luoi/chuyen-gia" },
      { label: "Case study", href: "/tri-thuc/case-study" },
      { label: "Sự kiện", href: "/su-kien" },
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
            <p className="mt-4 text-sm leading-relaxed text-white/75">{siteConfig.tagline}</p>
            <p className="mt-2 text-sm leading-relaxed text-white/70">{siteConfig.positioning}</p>
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
              <p className="text-white/60">MST {siteConfig.taxId}</p>
            </address>
            <p className="mt-4">
              <Link href="/chinh-sach-quyen-rieng-tu" className="text-sm text-vabix-soft-gold hover:text-vabix-gold">
                Chính sách quyền riêng tư
              </Link>
            </p>
          </div>
        </div>
      </Container>
      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-3 py-5 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.legalName}. {siteConfig.tagline}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/chinh-sach-quyen-rieng-tu" className="hover:text-white">
              Quyền riêng tư
            </Link>
            <Link href="/dieu-khoan" className="hover:text-white">
              Điều khoản
            </Link>
            <Link href="/chinh-sach-bao-mat" className="hover:text-white">
              Bảo mật
            </Link>
            <Link href="/khuyen-cao" className="hover:text-white">
              Khuyến cáo
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}

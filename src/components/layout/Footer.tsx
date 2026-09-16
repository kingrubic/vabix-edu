import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import { Container } from "@/components/ui/Section";
import { Logo } from "@/components/brand/Logo";

const cols = [
  {
    title: "Đào tạo & huấn luyện",
    links: [
      { label: "Tổng quan đào tạo", href: "/dao-tao" },
      { label: "BMDO", href: "/dao-tao/bmdo" },
      { label: "MBM", href: "/dao-tao/mbm" },
      { label: "Đào tạo theo yêu cầu", href: "/dao-tao/theo-yeu-cau-doanh-nghiep" },
    ],
  },
  {
    title: "3T",
    links: [
      { label: "Tư vấn chuyển đổi", href: "/tu-van-chuyen-doi" },
      { label: "Trustworking", href: "/trustworking" },
      { label: "Mô hình & phương pháp", href: "/mo-hinh-phuong-phap" },
      { label: "Về VABIX", href: "/ve-vabix" },
    ],
  },
  {
    title: "Tri thức",
    links: [
      { label: "Hệ sinh thái tri thức", href: "/tri-thuc" },
      { label: "Sách", href: "/sach" },
      { label: "Cẩm nang", href: "/cam-nang" },
      { label: "Góc chia sẻ", href: "/goc-chia-se" },
      { label: "Đội ngũ / chuyên gia", href: "/mang-luoi/chuyen-gia" },
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
            <Link href="/vabix" aria-label="VABIX — trang chủ">
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
              <Link href="/dang-nhap" className="text-sm text-vabix-soft-gold hover:text-vabix-gold">
                Cổng học viên
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

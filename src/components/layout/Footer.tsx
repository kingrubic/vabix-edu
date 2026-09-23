import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import { footerColumns } from "@/content/navigation";
import { BrandLockup } from "@/components/brand/Logo";
import { ArrowIcon } from "@/components/ui/Misc";

const socials = [
  { label: "Facebook", href: siteConfig.social.facebook, icon: FacebookIcon },
  { label: "LinkedIn", href: siteConfig.social.linkedin, icon: LinkedInIcon },
  { label: "YouTube", href: siteConfig.social.youtube, icon: YouTubeIcon },
] as const;

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="vabix-footer">
      <div className="vabix-footer-atmosphere" aria-hidden="true">
        <span className="vabix-footer-glow vabix-footer-glow-gold" />
        <span className="vabix-footer-glow vabix-footer-glow-teal" />
        <span className="vabix-footer-mesh" />
        <span className="vabix-footer-orbit vabix-footer-orbit-a" />
        <span className="vabix-footer-orbit vabix-footer-orbit-b" />
        <span className="vabix-footer-orbit vabix-footer-orbit-c" />
      </div>

      <div className="vabix-shell relative z-10 py-12">
        <div className="grid gap-x-8 gap-y-9 sm:grid-cols-2 lg:grid-cols-[minmax(12.5rem,1.05fr)_repeat(4,minmax(0,1fr))_minmax(11rem,1.2fr)]">
          <div>
            <Link href={siteConfig.portals.vabixHome} className="inline-flex items-center" aria-label="VABIX — trang chủ">
              <BrandLockup tagline={false} markClassName="h-14 w-14" />
            </Link>
            <ul className="mt-4 flex items-center gap-1.5">
              {socials.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                    className="vabix-footer-social"
                  >
                    <item.icon />
                  </a>
                </li>
              ))}
            </ul>
            <Link
              href={siteConfig.cta.register.href}
              className="group mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-vabix-gold hover:text-vabix-soft-gold"
            >
              {siteConfig.cta.register.label}
              <span className="inline-flex transition-transform duration-200 group-hover:translate-x-[3px]">
                <ArrowIcon className="h-3.5 w-3.5" />
              </span>
            </Link>
          </div>

          {footerColumns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <Link
                href={col.href}
                className="eyebrow mb-3 inline-block text-vabix-gold hover:text-vabix-soft-gold"
              >
                {col.title}
              </Link>
              <ul className="space-y-1.5 text-[13px] leading-snug text-white/80">
                {col.links.map((link) => (
                  <li key={`${col.title}-${link.href}`}>
                    <Link href={link.href} className="transition-colors duration-200 hover:text-vabix-gold">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <p className="eyebrow mb-3">Liên hệ</p>
            <address className="space-y-1.5 text-[13px] leading-snug not-italic text-white/80">
              <p>{siteConfig.contact.addressShort}</p>
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
              <p className="text-white/55">MST {siteConfig.taxId}</p>
            </address>
            <p className="mt-3">
              <Link href={siteConfig.cta.learner.href} className="text-[13px] text-vabix-soft-gold hover:text-vabix-gold">
                {siteConfig.cta.learner.label}
                <span aria-hidden className="ml-1 text-[11px] opacity-70">
                  ↗
                </span>
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="relative z-10 border-t border-white/10">
        <div className="vabix-shell flex flex-col gap-2 py-4 text-[11px] text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.legalName}. {siteConfig.tagline}
          </p>
          <div className="flex flex-wrap gap-3.5">
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
        </div>
      </div>
    </footer>
  );
}

function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M14.5 8.5V6.8c0-.7.5-1.3 1.2-1.3H17V3h-2.2C12.4 3 11 4.5 11 6.6v1.9H9v2.5h2V21h3.5v-10h2.2l.3-2.5h-2.5z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6.5 9.5H3.7V21h2.8V9.5zM5.1 3.5A1.65 1.65 0 1 0 5.1 6.8 1.65 1.65 0 0 0 5.1 3.5zM21 21h-2.8v-5.6c0-1.6-.6-2.7-2-2.7-1.1 0-1.7.7-2 1.4-.1.3-.1.7-.1 1.1V21H11.3s.04-9.3 0-10.3h2.8v1.5c.4-.7 1.3-1.8 3.3-1.8 2.4 0 4.2 1.6 4.2 5V21z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg width="18" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23 12.2s0-3.2-.4-4.6c-.2-.9-.9-1.6-1.8-1.8C19.2 5.4 12 5.4 12 5.4s-7.2 0-8.8.4c-.9.2-1.6.9-1.8 1.8C1 9 1 12.2 1 12.2s0 3.2.4 4.6c.2.9.9 1.6 1.8 1.8 1.6.4 8.8.4 8.8.4s7.2 0 8.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.4.4-4.6.4-4.6zM9.8 15.5V8.9l6.2 3.3-6.2 3.3z" />
    </svg>
  );
}

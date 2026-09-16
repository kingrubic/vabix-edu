"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { primaryNav } from "@/content/navigation";
import { siteConfig } from "@/lib/siteConfig";
import { Button } from "@/components/ui/Button";
import { MegaMenu } from "@/components/layout/MegaMenu";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { Logo } from "@/components/brand/Logo";

function hasDarkHero(pathname: string | null) {
  if (!pathname || pathname === "/" || pathname === "/vabix") return true;
  return pathname.startsWith("/mo-hinh-phuong-phap/") && pathname !== "/mo-hinh-phuong-phap/";
}

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const solid = scrolled || open || !hasDarkHero(pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          solid
            ? `border-b border-vabix-deep-teal/10 text-vabix-deep-teal shadow-[0_8px_30px_rgba(22,60,62,0.08)] ${
                open ? "bg-vabix-warm" : "bg-vabix-warm/95 backdrop-blur"
              }`
            : "bg-transparent text-white"
        }`}
      >
        <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center gap-3 px-4 sm:h-[72px] sm:px-6 lg:gap-4 lg:px-8">
          <Link href={siteConfig.portals.vabixHome} className="flex shrink-0 items-center" aria-label="VABIX — trang chủ">
            <Logo variant={solid ? "light" : "dark"} className="h-10 max-w-[min(168px,42vw)] sm:h-11" priority />
          </Link>

          <MegaMenu items={primaryNav} inverted={!solid} />

          <div className="relative z-10 ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
            <Link
              href="/tim-kiem"
              className={`hidden h-10 w-10 items-center justify-center xl:inline-flex ${
                solid ? "text-vabix-muted hover:text-vabix-deep-teal" : "text-white/80 hover:text-white"
              }`}
              aria-label="Tìm kiếm"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="11" cy="11" r="6.25" stroke="currentColor" strokeWidth="1.75" />
                <path d="M16 16.5 20 20.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              </svg>
            </Link>
            <Button href="/dang-nhap" variant="gold" className="min-h-10 px-3 text-[13px] sm:px-4">
              Cổng học viên
            </Button>
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center xl:hidden"
              aria-expanded={open}
              aria-controls={menuId}
              aria-label={open ? "Đóng menu" : "Mở menu"}
              onClick={() => setOpen((v) => !v)}
            >
              <span className="sr-only">Menu</span>
              <span className="flex w-5 flex-col gap-1.5">
                <span className={`h-px w-full ${solid ? "bg-vabix-deep-teal" : "bg-white"}`} />
                <span className={`h-px w-full ${solid ? "bg-vabix-deep-teal" : "bg-white"}`} />
                <span className={`h-px w-3 ${solid ? "bg-vabix-deep-teal" : "bg-white"}`} />
              </span>
            </button>
          </div>
        </div>
      </header>
      <MobileMenu id={menuId} open={open} onClose={() => setOpen(false)} />
    </>
  );
}

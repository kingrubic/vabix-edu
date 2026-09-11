"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { primaryNav } from "@/content/navigation";
import { Button } from "@/components/ui/Button";
import { MegaMenu } from "@/components/layout/MegaMenu";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { Logo } from "@/components/brand/Logo";

function hasDarkHero(pathname: string) {
  if (pathname === "/" || pathname === "/vabix") return true;
  return pathname.startsWith("/mo-hinh-phuong-phap/") && pathname !== "/mo-hinh-phuong-phap/";
}

export function Header({ homeHref = "/" }: { homeHref?: string }) {
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
        <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-3 px-4 sm:h-[76px] sm:px-6 lg:px-8">
          <Link href={homeHref} className="flex shrink-0 items-center" aria-label="VABIX — trang chủ">
            <Logo variant={solid ? "light" : "dark"} priority />
          </Link>

          <MegaMenu items={primaryNav} inverted={!solid} />

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Link
              href="/cong-cu-dan"
              className={`hidden text-[12px] font-semibold tracking-[0.12em] uppercase 2xl:inline ${
                solid ? "text-vabix-muted hover:text-vabix-deep-teal" : "text-white/80 hover:text-white"
              }`}
            >
              Cổng Cư dân
            </Link>
            <Button href="/ket-noi#tu-van" variant="gold" className="max-2xl:hidden min-h-10 px-4 text-sm">
              Trao đổi nhu cầu
            </Button>
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center 2xl:hidden"
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

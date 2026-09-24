"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { siteConfig } from "@/lib/siteConfig";
import { chrome, navFor } from "@/i18n/nav";
import { localeFromPathname, stripLocale, withLocale } from "@/i18n/locale";
import { Button } from "@/components/ui/Button";
import { LanguageSwitch } from "./LanguageSwitch";
import { MegaMenu } from "@/components/layout/MegaMenu";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { BrandLockup } from "@/components/brand/Logo";
import { ArrowIcon } from "@/components/ui/Misc";

function hasDarkHero(pathname: string | null) {
  const path = pathname ? stripLocale(pathname) : pathname;
  if (!path || path === "/" || path === "/vabix") return true;
  pathname = path;
  return pathname.startsWith("/mo-hinh-phuong-phap/") && pathname !== "/mo-hinh-phuong-phap/";
}

export function Header() {
  const pathname = usePathname();
  const locale = localeFromPathname(pathname ?? "/");
  const ui = chrome(locale);
  const nav = navFor(locale);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const overlay = hasDarkHero(pathname) && !open;
  const inverted = overlay;
  const solid = !overlay;

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

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[height,background-color,box-shadow,border-color,color] duration-[280ms] ${
          overlay
            ? `${
                scrolled
                  ? "border-b border-white/10 bg-vabix-deep-teal/92 shadow-[0_10px_28px_rgba(8,20,22,0.28)] backdrop-blur-md"
                  : "border-b border-white/0 bg-vabix-deep-teal"
              } text-[#f4efe4]`
            : `border-b border-vabix-deep-teal/10 text-vabix-deep-teal ${
                open ? "bg-vabix-warm" : "bg-vabix-warm/95 backdrop-blur-md shadow-[0_8px_28px_rgba(22,60,62,0.07)]"
              }`
        } ${scrolled ? "h-[72px]" : "h-[72px] xl:h-[88px]"}`}
      >
        <div className="vabix-shell flex h-full items-center gap-4 lg:gap-8">
          <Link href={withLocale(siteConfig.portals.vabixHome, locale)} className="flex shrink-0 items-center" aria-label={ui.home}>
            <BrandLockup tone={solid ? "onLight" : "onDark"} priority markClassName={scrolled ? "h-11" : "h-12 sm:h-14"} taglineText={ui.tagline} />
          </Link>

          <MegaMenu items={nav} inverted={inverted} />

          <div className="relative z-10 ml-auto flex shrink-0 items-center gap-1 sm:gap-2 lg:gap-3">
            <Link
              href={withLocale("/tim-kiem", locale)}
              className={`hidden h-10 w-10 items-center justify-center xl:inline-flex ${
                solid ? "text-vabix-muted hover:text-vabix-deep-teal" : "text-[#f4efe4]/80 hover:text-vabix-gold"
              }`}
              aria-label={ui.search}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="11" cy="11" r="6.25" stroke="currentColor" strokeWidth="1.75" />
                <path d="M16 16.5 20 20.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              </svg>
            </Link>
            <Link
              href={withLocale(siteConfig.cta.learner.href, locale)}
              className={`hidden items-center gap-1 px-2.5 py-2 text-[13px] font-medium xl:inline-flex ${
                solid ? "text-vabix-deep-teal/80 hover:text-vabix-deep-teal" : "text-[#f4efe4]/80 hover:text-vabix-gold"
              }`}
            >
              {ui.learner}
              <span aria-hidden className="text-[11px] opacity-70">
                ↗
              </span>
            </Link>
            <div className="hidden xl:block">
              <Button
                href={withLocale(siteConfig.cta.register.href, locale)}
                variant="gold"
                className="group min-h-10 rounded-md px-4 text-[13px] font-semibold tracking-[0.02em] transition-[transform,box-shadow,background-color] duration-200 hover:-translate-y-0.5 hover:bg-vabix-soft-gold hover:shadow-[0_10px_22px_rgba(222,164,67,0.22)]"
              >
                {ui.register}
                <span className="inline-flex transition-transform duration-200 group-hover:translate-x-[3px]">
                  <ArrowIcon className="h-3.5 w-3.5" />
                </span>
              </Button>
            </div>
            <LanguageSwitch inverted={inverted} />
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center xl:hidden"
              aria-expanded={open}
              aria-controls={menuId}
              aria-label={open ? ui.menuClose : ui.menuOpen}
              onClick={() => setOpen((v) => !v)}
            >
              <span className="sr-only">Menu</span>
              <span className="flex w-5 flex-col gap-1.5">
                <span className={`h-px w-full ${solid ? "bg-vabix-deep-teal" : "bg-[#f4efe4]"}`} />
                <span className={`h-px w-full ${solid ? "bg-vabix-deep-teal" : "bg-[#f4efe4]"}`} />
                <span className={`h-px w-3 ${solid ? "bg-vabix-deep-teal" : "bg-[#f4efe4]"}`} />
              </span>
            </button>
          </div>
        </div>
      </header>
      <MobileMenu id={menuId} open={open} onClose={() => setOpen(false)} locale={locale} />
    </>
  );
}

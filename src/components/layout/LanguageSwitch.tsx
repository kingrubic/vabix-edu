"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { localeFromPathname, switchLocalePath, type Locale } from "@/i18n/locale";

export function LanguageSwitch({ inverted }: { inverted?: boolean }) {
  const pathname = usePathname() ?? "/";
  const locale = localeFromPathname(pathname);
  const tone = inverted ? "text-[#f4efe4]/75" : "text-vabix-deep-teal/70";
  const active = inverted ? "bg-[#f4efe4] text-vabix-deep-teal" : "bg-vabix-deep-teal text-[#f4efe4]";

  return (
    <div className={`flex items-center rounded-full border p-0.5 text-[11px] font-semibold tracking-[0.08em] ${inverted ? "border-white/20" : "border-vabix-deep-teal/15"} ${tone}`} role="group" aria-label={locale === "en" ? "Language" : "Ngôn ngữ"}>
      <LocaleLink code="vi" current={locale} href={switchLocalePath(pathname, "vi")} activeClass={active} />
      <LocaleLink code="en" current={locale} href={switchLocalePath(pathname, "en")} activeClass={active} />
    </div>
  );
}

function LocaleLink({ code, current, href, activeClass }: { code: Locale; current: Locale; href: string; activeClass: string }) {
  const on = current === code;
  return (
    <Link
      href={href}
      hrefLang={code}
      aria-current={on ? "true" : undefined}
      className={`rounded-full px-2 py-1 uppercase ${on ? activeClass : "hover:text-vabix-gold"}`}
    >
      {code}
    </Link>
  );
}

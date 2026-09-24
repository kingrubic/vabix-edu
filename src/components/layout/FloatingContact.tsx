"use client";

import { useEffect, useId, useState } from "react";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/siteConfig";
import { localeFromPathname } from "@/i18n/locale";

const items = [
  {
    label: "Zalo",
    href: siteConfig.social.zaloChat,
    external: true,
    ariaVi: "Chat Zalo với VABIX",
    ariaEn: "Chat with VABIX on Zalo",
    icon: ZaloIcon,
  },
  {
    label: siteConfig.contact.quickPhone,
    href: siteConfig.contact.quickPhoneHref,
    external: false,
    ariaVi: `Gọi ${siteConfig.contact.quickPhone}`,
    ariaEn: `Call ${siteConfig.contact.quickPhone}`,
    icon: PhoneIcon,
  },
  {
    label: siteConfig.contact.quickEmail,
    href: siteConfig.contact.quickEmailHref,
    external: false,
    ariaVi: `Gửi email ${siteConfig.contact.quickEmail}`,
    ariaEn: `Email ${siteConfig.contact.quickEmail}`,
    icon: MailIcon,
  },
] as const;

export function FloatingContact() {
  const locale = localeFromPathname(usePathname() ?? "/");
  const en = locale === "en";
  const [open, setOpen] = useState(false);
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <nav className={`vabix-float${open ? " is-open" : ""}`} aria-label={en ? "Quick contact" : "Liên hệ nhanh"}>
      <ul className="vabix-float-list" id={listId}>
        {items.map((item) => (
          <li key={item.href}>
            <a
              className="vabix-float-link"
              href={item.href}
              aria-label={en ? item.ariaEn : item.ariaVi}
              {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              <span className="vabix-float-label">{item.label}</span>
              <span className="vabix-float-icon">
                <item.icon />
              </span>
            </a>
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="vabix-float-toggle"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={open ? (en ? "Close quick contact" : "Đóng liên hệ nhanh") : en ? "Open quick contact" : "Mở liên hệ nhanh"}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <CloseIcon /> : <PhoneIcon />}
      </button>
    </nav>
  );
}

function ZaloIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 5.5h12a2 2 0 0 1 2 2v7.2a2 2 0 0 1-2 2H10.2L6.8 20v-3.3H6a2 2 0 0 1-2-2V7.5a2 2 0 0 1 2-2z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M8.4 9.5h6.2M14.5 9.5 9.3 14.6M9.3 14.6h6.3"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M8.2 4.8h1.8c.4 0 .8.3.9.7l.7 2.2a1 1 0 0 1-.3.9l-1.2.9a10.8 10.8 0 0 0 4.4 4.4l.9-1.2a1 1 0 0 1 .9-.3l2.2.7c.4.1.7.5.7.9v1.8A1.6 1.6 0 0 1 17.6 18C11.2 17.6 6.4 12.8 6 6.4A1.6 1.6 0 0 1 7.6 4.8h.6z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3.8" y="5.6" width="16.4" height="12.4" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M4.4 7.4 12 12.4l7.6-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

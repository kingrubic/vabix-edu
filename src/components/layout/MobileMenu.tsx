"use client";

import Link from "next/link";
import { useState } from "react";
import { primaryNav } from "@/content/navigation";
import { siteConfig } from "@/lib/siteConfig";
import { Button } from "@/components/ui/Button";

export function MobileMenu({ id, open, onClose }: { id: string; open: boolean; onClose: () => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  if (!open) return null;

  return (
    <div
      id={id}
      className="fixed inset-x-0 bottom-0 top-16 z-[60] overflow-y-auto bg-vabix-warm text-vabix-deep-teal sm:top-[76px] xl:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Menu di động"
    >
      <nav className="flex min-h-full flex-col px-5 py-6">
        {primaryNav.map((item) => {
          const children = item.groups?.flatMap((g) => g.children) ?? item.children;
          if (!children?.length) {
            return (
              <Link key={item.href} href={item.href} onClick={onClose} className="border-b border-vabix-deep-teal/10 py-3.5 text-base font-semibold">
                {item.label}
              </Link>
            );
          }
          const isOpen = expanded === item.label;
          return (
            <div key={item.label} className="border-b border-vabix-deep-teal/10">
              <button
                type="button"
                className="flex min-h-11 w-full items-center justify-between py-3.5 text-left text-base font-semibold"
                aria-expanded={isOpen}
                onClick={() => setExpanded(isOpen ? null : item.label)}
              >
                {item.label}
                <span aria-hidden>{isOpen ? "−" : "+"}</span>
              </button>
              {isOpen ? (
                <ul className="mb-3 space-y-1 pb-2 pl-3">
                  <li>
                    <Link href={item.href} onClick={onClose} className="block py-2 text-sm text-vabix-muted">
                      Xem tất cả
                    </Link>
                  </li>
                  {item.groups?.map((group) => (
                    <li key={group.label} className="pt-2">
                      <p className="eyebrow mb-1">{group.label}</p>
                      <ul>
                        {group.children.map((child) => (
                          <li key={child.href}>
                            <Link href={child.href} onClick={onClose} className="block py-2 text-sm">
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                  {item.children?.map((child) => (
                    <li key={child.href}>
                      <Link href={child.href} onClick={onClose} className="block py-2 text-sm">
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          );
        })}
        <Link href="/dang-nhap" onClick={onClose} className="py-4 text-sm font-semibold tracking-[0.12em] uppercase text-vabix-muted">
          Đăng nhập
        </Link>
        <Link href="/cong-cu-dan" onClick={onClose} className="py-4 text-sm font-semibold tracking-[0.12em] uppercase text-vabix-muted">
          Cổng Cư dân
        </Link>
        <div className="mt-4 flex flex-col gap-3">
          <Button href="/ket-noi#tu-van" onClick={onClose}>
            Trao đổi nhu cầu doanh nghiệp
          </Button>
          <p className="text-sm text-vabix-muted">
            {siteConfig.contact.hotline} · {siteConfig.contact.email}
          </p>
        </div>
      </nav>
    </div>
  );
}

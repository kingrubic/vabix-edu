"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { primaryNav, type NavItem } from "@/content/navigation";
import { siteConfig } from "@/lib/siteConfig";
import { paths } from "@/lib/paths";
import { Button } from "@/components/ui/Button";
import { ArrowIcon } from "@/components/ui/Misc";

export function MobileMenu({ id, open, onClose }: { id: string; open: boolean; onClose: () => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!open) setExpanded(null);
  }, [open]);

  if (!open) return null;

  return (
    <div
      id={id}
      className="fixed inset-x-0 bottom-0 top-[72px] z-[60] overflow-y-auto bg-vabix-warm text-vabix-deep-teal xl:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Menu di động"
    >
      <nav className="flex min-h-full flex-col px-5 py-4">
        {primaryNav.map((item) => (
          <MobileItem key={item.label} item={item} expanded={expanded} setExpanded={setExpanded} onClose={onClose} />
        ))}

        <div className="mt-6 border-t border-vabix-deep-teal/10 pt-5">
          <Link
            href={paths.search}
            onClick={onClose}
            className="flex min-h-11 items-center text-[15px] font-medium text-vabix-muted"
          >
            Tìm kiếm
          </Link>
          <Link
            href={siteConfig.cta.learner.href}
            onClick={onClose}
            className="flex min-h-11 items-center text-[15px] font-medium text-vabix-deep-teal"
          >
            {siteConfig.cta.learner.label}
            <span aria-hidden className="ml-1 text-[12px] opacity-60">
              ↗
            </span>
          </Link>
          <Button
            href={siteConfig.cta.register.href}
            onClick={onClose}
            className="group mt-4 min-h-12 w-full rounded-md text-[15px] font-semibold"
          >
            {siteConfig.cta.register.label}
            <span className="inline-flex transition-transform duration-200 group-hover:translate-x-[3px]">
              <ArrowIcon />
            </span>
          </Button>
          <p className="mt-5 pb-8 text-sm text-vabix-muted">
            {siteConfig.contact.hotline} · {siteConfig.contact.email}
          </p>
        </div>
      </nav>
    </div>
  );
}

function MobileItem({
  item,
  expanded,
  setExpanded,
  onClose,
}: {
  item: NavItem;
  expanded: string | null;
  setExpanded: (value: string | null) => void;
  onClose: () => void;
}) {
  const panelId = useId();
  const children = item.groups?.flatMap((g) => g.children) ?? item.children;
  if (!children?.length) {
    return (
      <Link
        href={item.href}
        onClick={onClose}
        className="flex min-h-11 items-center border-b border-vabix-deep-teal/10 py-3.5 text-base font-semibold"
      >
        {item.label}
      </Link>
    );
  }

  const isOpen = expanded === item.label;
  return (
    <div className="border-b border-vabix-deep-teal/10">
      <button
        type="button"
        className="flex min-h-11 w-full items-center justify-between py-3.5 text-left text-base font-semibold"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setExpanded(isOpen ? null : item.label)}
      >
        {item.label}
        <span aria-hidden className={`text-lg font-normal leading-none transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`}>
          +
        </span>
      </button>
      {isOpen ? (
        <ul id={panelId} className="mb-3 space-y-0.5 pb-3 pl-3">
          <li>
            <Link href={item.href} onClick={onClose} className="block min-h-11 py-2.5 text-sm text-vabix-muted">
              Xem tất cả
            </Link>
          </li>
          {item.groups?.map((group) => (
            <li key={group.label} className="pt-1">
              <p className="pt-2 text-[11px] font-semibold tracking-[0.16em] text-vabix-gold uppercase">{group.label}</p>
              <ul>
                {group.children.map((child) => (
                  <li key={child.href}>
                    <Link href={child.href} onClick={onClose} className="block min-h-11 py-2.5 text-sm">
                      {child.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
          {item.children?.map((child) => (
            <li key={child.href}>
              <Link href={child.href} onClick={onClose} className="block min-h-11 py-2.5 text-sm">
                {child.label}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

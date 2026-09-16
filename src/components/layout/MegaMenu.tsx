"use client";

import Link from "next/link";
import { useState } from "react";
import type { NavItem } from "@/content/navigation";

export function MegaMenu({ items, inverted }: { items: NavItem[]; inverted: boolean }) {
  const [active, setActive] = useState<string | null>(null);
  const linkCls = inverted
    ? "text-white/90 hover:text-vabix-gold"
    : "text-vabix-deep-teal/90 hover:text-vabix-deep-teal";

  return (
    <nav
      className="hidden min-w-0 flex-1 items-center justify-center overflow-hidden xl:flex"
      aria-label="Điều hướng chính"
    >
      {items.map((item) => {
        const hasMenu = Boolean(item.groups?.length || item.children?.length);
        const headerLabel = item.shortLabel ?? item.label;
        if (!hasMenu) {
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              className={`px-1.5 py-2 text-[12.5px] font-medium whitespace-nowrap 2xl:px-2 2xl:text-[13px] ${linkCls}`}
            >
              {headerLabel}
            </Link>
          );
        }
        const open = active === item.label;
        return (
          <div
            key={item.label}
            className="relative"
            onMouseEnter={() => setActive(item.label)}
            onMouseLeave={() => setActive(null)}
          >
            <Link
              href={item.href}
              className={`flex items-center gap-0.5 px-1.5 py-2 text-[12.5px] font-medium whitespace-nowrap 2xl:px-2 2xl:text-[13px] ${linkCls}`}
              aria-label={item.label}
              aria-expanded={open}
              aria-haspopup="true"
            >
              {headerLabel}
              <span aria-hidden className="text-[10px]">
                ▾
              </span>
            </Link>
            {open ? (
              <div className="absolute left-1/2 top-full z-50 w-[min(90vw,720px)] -translate-x-1/2 pt-2">
                <div className="border border-vabix-deep-teal/10 bg-vabix-warm p-6 shadow-[0_24px_60px_rgba(22,60,62,0.16)]">
                  {item.groups ? (
                    <div className="grid grid-cols-2 gap-8">
                      {item.groups.map((group) => (
                        <div key={group.label}>
                          <p className="eyebrow mb-3 text-vabix-gold">{group.label}</p>
                          <ul className="space-y-2">
                            {group.children.map((child) => (
                              <li key={child.href}>
                                <Link
                                  href={child.href}
                                  className="block rounded-sm px-1 py-1.5 text-vabix-deep-teal hover:bg-vabix-ivory"
                                >
                                  <span className="block text-sm font-semibold">{child.label}</span>
                                  {child.description ? (
                                    <span className="mt-0.5 block text-[13px] font-normal text-vabix-muted">
                                      {child.description}
                                    </span>
                                  ) : null}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <ul className="grid grid-cols-2 gap-x-8 gap-y-2">
                      {item.children?.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className="block rounded-sm px-1 py-1.5 text-sm font-semibold text-vabix-deep-teal hover:bg-vabix-ivory"
                          >
                            {child.label}
                            {child.description ? (
                              <span className="mt-0.5 block text-[13px] font-normal text-vabix-muted">
                                {child.description}
                              </span>
                            ) : null}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
    </nav>
  );
}

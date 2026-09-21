"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { isNavItemActive, type NavChild, type NavItem } from "@/content/navigation";
import { ArrowIcon } from "@/components/ui/Misc";

export function MegaMenu({ items, inverted }: { items: NavItem[]; inverted: boolean }) {
  const pathname = usePathname();
  const [active, setActive] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<number | null>(null);

  const openMenu = (label: string) => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setActive(label);
  };

  const scheduleClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setActive(null), 140);
  };

  useEffect(() => {
    setActive(null);
  }, [pathname]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActive(null);
    };
    const onPointer = (event: MouseEvent) => {
      if (!navRef.current?.contains(event.target as Node)) setActive(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointer);
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
    };
  }, []);

  const linkTone = inverted
    ? "text-[#f4efe4]/90 hover:text-vabix-gold"
    : "text-vabix-deep-teal/90 hover:text-vabix-gold";

  return (
    <nav
      ref={navRef}
      className="hidden min-w-0 flex-1 items-center justify-evenly xl:flex"
      aria-label="Điều hướng chính"
      onMouseEnter={() => {
        if (closeTimer.current) window.clearTimeout(closeTimer.current);
      }}
      onMouseLeave={scheduleClose}
      onBlurCapture={(event) => {
        if (!navRef.current?.contains(event.relatedTarget as Node)) scheduleClose();
      }}
    >
      {items.map((item) => {
        const hasMenu = Boolean(item.groups?.length || item.children?.length);
        const headerLabel = item.shortLabel ?? item.label;
        const open = active === item.label;
        const current = isNavItemActive(item, pathname);
        const panelId = `nav-panel-${item.label.replace(/\s+/g, "-").toLowerCase()}`;

        if (!hasMenu) {
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={current ? "page" : undefined}
              className={`vabix-nav-link px-0.5 py-2 text-[14px] font-medium tracking-[0.01em] whitespace-nowrap ${current ? "text-vabix-gold" : linkTone}`}
              data-active={current ? "true" : "false"}
            >
              {headerLabel}
            </Link>
          );
        }

        return (
          <div
            key={item.label}
            className="relative"
            onMouseEnter={() => openMenu(item.label)}
            onFocusCapture={() => openMenu(item.label)}
          >
            <Link
              href={item.href}
              className={`vabix-nav-link inline-flex items-center gap-1 px-0.5 py-2 text-[14px] font-medium tracking-[0.01em] whitespace-nowrap ${current ? "text-vabix-gold" : linkTone}`}
              aria-expanded={open}
              aria-haspopup="true"
              aria-controls={panelId}
              aria-current={current ? "page" : undefined}
              data-active={current ? "true" : "false"}
              onClick={() => openMenu(item.label)}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown" || event.key === " ") {
                  event.preventDefault();
                  openMenu(item.label);
                }
              }}
            >
              {headerLabel}
              <span
                aria-hidden
                className={`text-[9px] leading-none transition-transform duration-200 ${open ? "rotate-180" : ""}`}
              >
                ▼
              </span>
            </Link>
            {open ? (
              <div id={panelId} className="absolute left-0 top-full z-50 pt-3">
                {item.variant === "mega" ? <MegaPanel item={item} /> : <DropdownPanel item={item} />}
              </div>
            ) : null}
          </div>
        );
      })}
    </nav>
  );
}

function DropdownPanel({ item }: { item: NavItem }) {
  return (
    <div className="vabix-nav-panel w-[min(92vw,560px)] rounded-[16px] border border-vabix-deep-teal/10 bg-vabix-warm p-5 shadow-[0_22px_50px_rgba(22,60,62,0.14)]">
      {item.groups ? (
        <div className="grid gap-8 sm:grid-cols-2">
          {item.groups.map((group) => (
            <div key={group.label}>
              <p className="mb-3 text-[11px] font-semibold tracking-[0.16em] text-vabix-gold uppercase">{group.label}</p>
              <ul className="space-y-1">
                {group.children.map((child) => (
                  <ChildLink key={child.href} child={child} />
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <ul className="space-y-1">
          {item.children?.map((child) => (
            <ChildLink key={child.href} child={child} />
          ))}
        </ul>
      )}
    </div>
  );
}

function MegaPanel({ item }: { item: NavItem }) {
  const eco = item.ecosystem;
  return (
    <div className="vabix-nav-panel grid w-[min(92vw,740px)] grid-cols-[minmax(0,1.4fr)_minmax(220px,0.8fr)] overflow-hidden rounded-[16px] border border-vabix-deep-teal/10 bg-vabix-warm shadow-[0_22px_50px_rgba(22,60,62,0.14)]">
      <div className="p-6">
        <p className="mb-4 text-[11px] font-semibold tracking-[0.16em] text-vabix-gold uppercase">{item.label}</p>
        <ul className="space-y-1">
          {item.children?.map((child) => (
            <ChildLink key={child.href} child={child} />
          ))}
        </ul>
      </div>
      {eco ? (
        <aside className="border-l border-vabix-deep-teal/10 bg-vabix-ivory/80 px-6 py-6">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-vabix-gold uppercase">{eco.title}</p>
          {eco.note ? <p className="mt-3 text-[13px] leading-relaxed text-vabix-muted">{eco.note}</p> : null}
          <ul className="mt-5 space-y-2.5">
            {eco.items.map((row) => (
              <li key={row.label}>
                <Link href={row.href} className="text-[14px] font-medium text-vabix-deep-teal hover:text-vabix-gold">
                  {row.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href={eco.cta.href}
            className="group mt-6 inline-flex items-center gap-1.5 text-[13px] font-semibold text-vabix-deep-teal"
          >
            {eco.cta.label}
            <span className="transition-transform duration-200 group-hover:translate-x-[3px]">
              <ArrowIcon className="h-3.5 w-3.5" />
            </span>
          </Link>
        </aside>
      ) : null}
    </div>
  );
}

function ChildLink({ child }: { child: NavChild }) {
  return (
    <li>
      <Link
        href={child.href}
        className="group flex items-start justify-between gap-3 rounded-md px-2 py-2.5 text-vabix-deep-teal transition-colors duration-200 hover:bg-vabix-deep-teal/[0.04]"
      >
        <span>
          <span className="block text-[14px] font-semibold">{child.label}</span>
          {child.description ? (
            <span className="mt-0.5 block text-[13px] font-normal leading-snug text-vabix-muted">{child.description}</span>
          ) : null}
        </span>
        <span className="mt-1 inline-flex shrink-0 text-vabix-gold/0 transition-all duration-200 group-hover:translate-x-[3px] group-hover:text-vabix-gold">
          <ArrowIcon className="h-3.5 w-3.5" />
        </span>
      </Link>
    </li>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { platformLogoutAction } from "@/platform/auth/actions";
import type { MenuNode, Workspace } from "@/platform/permissions/registry";

const SPACE_LABEL: Record<Workspace, string> = {
  admin: "Làm việc / Quản trị",
  teaching: "Giảng dạy",
  learning: "Học tập",
  work: "Làm việc",
  account: "Tài khoản",
};

const SPACE_HREF: Partial<Record<Workspace, string>> = {
  admin: "/admin",
  teaching: "/giang-day",
  learning: "/hoc-tap",
  work: "/lam-viec",
  account: "/tai-khoan",
};

function NavList({ nodes, pathname }: { nodes: MenuNode[]; pathname: string }) {
  return (
    <ul className="space-y-1">
      {nodes.map((node) => {
        const active = node.path && (pathname === node.path || pathname.startsWith(`${node.path}/`));
        return (
          <li key={node.code}>
            {node.path ? (
              <Link
                href={node.path}
                className={`block rounded-lg px-3 py-2 text-sm ${
                  active ? "bg-white/10 text-white" : "text-white/80 hover:bg-white/5 hover:text-white"
                }`}
              >
                {node.label}
              </Link>
            ) : (
              <p className="px-3 pb-1 pt-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#e4b862]">
                {node.label}
              </p>
            )}
            {node.children?.length ? <div className="ml-1"><NavList nodes={node.children} pathname={pathname} /></div> : null}
          </li>
        );
      })}
    </ul>
  );
}

export function PlatformShell({
  name,
  role,
  workspace,
  workspaces,
  nodes,
  children,
}: {
  name: string;
  role: string;
  workspace: Workspace;
  workspaces: Workspace[];
  nodes: MenuNode[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const switchable = workspaces.filter((item) => item !== "account");

  return (
    <div className="platform-shell lg:grid lg:grid-cols-[260px_1fr]">
      <aside className={`platform-sidebar z-40 flex min-h-screen flex-col ${open ? "fixed inset-0" : "hidden lg:flex"}`}>
        <div className="flex items-center justify-between px-5 py-5">
          <Link href="/vabix" aria-label="Về website VABIX">
            <Logo variant="dark" className="h-9" />
          </Link>
          <button type="button" className="lg:hidden text-white" onClick={() => setOpen(false)} aria-label="Đóng menu">
            Đóng
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 pb-8" aria-label="Điều hướng chính">
          <NavList nodes={nodes} pathname={pathname} />
        </nav>
        <div className="border-t border-white/10 px-5 py-4 text-sm text-white/80">
          <p className="font-medium text-white">{name}</p>
          <p className="mt-0.5 text-xs uppercase tracking-wide text-[#e4b862]">{role}</p>
          <form action={platformLogoutAction} className="mt-3">
            <button type="submit" className="text-sm text-white/80 underline-offset-2 hover:underline">
              Đăng xuất
            </button>
          </form>
        </div>
      </aside>
      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-[#163c3e]/10 bg-[#f8f5ed]/95 px-4 py-3 backdrop-blur sm:px-6">
          <button type="button" className="lg:hidden" onClick={() => setOpen(true)} aria-label="Mở menu">
            Menu
          </button>
          <p className="text-sm font-medium text-[#163c3e]">{SPACE_LABEL[workspace]}</p>
          {switchable.length > 1 ? (
            <nav aria-label="Chuyển không gian" className="flex flex-wrap gap-2 text-sm">
              {switchable.map((space) => (
                <Link
                  key={space}
                  href={SPACE_HREF[space] ?? "/tai-khoan"}
                  className={`rounded-full px-3 py-1 ${
                    space === workspace ? "bg-[#163c3e] text-white" : "border border-[#163c3e]/20 text-[#163c3e]"
                  }`}
                >
                  {SPACE_LABEL[space]}
                </Link>
              ))}
            </nav>
          ) : (
            <Link href="/tai-khoan" className="text-sm text-[#163c3e] underline-offset-2 hover:underline">
              Tài khoản
            </Link>
          )}
        </header>
        <main id="noi-dung" className="px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="platform-card p-8">
      <h2 className="text-lg font-semibold text-[#163c3e]">{title}</h2>
      <p className="mt-2 text-[#66746f]">{body}</p>
    </div>
  );
}

export function Alert({ tone = "info", children }: { tone?: "info" | "error" | "success"; children: React.ReactNode }) {
  const cls =
    tone === "error"
      ? "border-red-300 bg-red-50 text-red-900"
      : tone === "success"
        ? "border-emerald-300 bg-emerald-50 text-emerald-950"
        : "border-[#dea443]/40 bg-[#dea443]/10 text-[#16332b]";
  return <div className={`rounded-xl border px-4 py-3 text-sm ${cls}`}>{children}</div>;
}

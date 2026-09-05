import Link from "next/link";
import { logoutAction } from "@/features/auth/actions";
import { CONFIDENTIALITY_BANNER } from "@/domain/labels";
import { Logo } from "@/components/brand/Logo";
import type { CurrentUser } from "@/security/session";
import { isAcademicAdmin, isPlatformAdmin } from "@/security/rbac";

export function ConfidentialityBanner() {
  return (
    <p className="border-b border-amber-400/20 bg-amber-500/10 px-4 py-2 text-center text-xs tracking-wide text-amber-100">
      {CONFIDENTIALITY_BANNER}
    </p>
  );
}

export function BizcarShell({
  user,
  children,
  title,
}: {
  user?: CurrentUser | null;
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <div className="bizcar-shell">
      <ConfidentialityBanner />
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/engine" className="flex items-center gap-3">
              <Logo variant="light" className="h-9" />
            </Link>
            <div>
              <p className="eyebrow">MyBizCar 3D</p>
              <p className="text-sm text-white/70">{title ?? "Động cơ doanh nghiệp MTUA"}</p>
            </div>
          </div>
          {user ? (
            <nav className="flex flex-wrap items-center gap-2 text-sm">
              <Link className="min-h-11 px-3 py-2 text-white/80 hover:text-vabix-gold" href="/dashboard">
                Bảng điều khiển
              </Link>
              <Link className="min-h-11 px-3 py-2 text-white/80 hover:text-vabix-gold" href="/assessments">
                Đánh giá
              </Link>
              {isAcademicAdmin(user.access) ? (
                <Link className="min-h-11 px-3 py-2 text-white/80 hover:text-vabix-gold" href="/admin/standards">
                  Chuẩn
                </Link>
              ) : null}
              {isPlatformAdmin(user.access) ? (
                <Link className="min-h-11 px-3 py-2 text-white/80 hover:text-vabix-gold" href="/admin">
                  Quản trị
                </Link>
              ) : null}
              <span className="px-2 text-white/50">{user.name}</span>
              <form action={logoutAction}>
                <button className="min-h-11 px-3 text-vabix-gold" type="submit">
                  Thoát
                </button>
              </form>
            </nav>
          ) : (
            <Link href="/login" className="min-h-11 px-4 py-2 font-semibold text-vabix-gold">
              Đăng nhập
            </Link>
          )}
        </div>
      </header>
      <main id="noi-dung">{children}</main>
    </div>
  );
}

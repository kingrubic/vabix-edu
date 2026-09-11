import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { appCopy } from "@/mybizcar/domain";
import { bizcarPath } from "@/lib/bizcarPaths";
import { logoutAction } from "@/features/auth/actions";
import { isAcademicAdmin, isPlatformAdmin } from "@/security/rbac";
import type { CurrentUser } from "@/security/session";

export function DevelopmentBanner() {
  return (
    <p className="border border-[#DDE3DE] bg-white px-3 py-2 text-sm text-[#626D68]">
      {appCopy.developmentBanner} {appCopy.mnemonicNote}
    </p>
  );
}

export function ConfidentialBanner() {
  return (
    <div className="border-b border-[#DDE3DE] bg-white px-4 py-2 text-center text-[12px] tracking-[0.12em] text-[#626D68] uppercase">
      {appCopy.confidentiality}
    </div>
  );
}

export function BizcarPublicHeader({ user }: { user: CurrentUser | null }) {
  return (
    <header className="sticky top-0 z-40 border-b border-[#D9E2DC] bg-[#F3F2ED]/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6">
        <Link href={user ? bizcarPath.dashboard : bizcarPath.home} className="flex items-center gap-3" aria-label="MyBizCar">
          <Logo variant="dark" className="h-9" />
          <span className="hidden text-sm tracking-[0.14em] text-[#626D68] uppercase sm:block">MyBizCar 3D</span>
        </Link>
        <nav className="flex items-center gap-2 text-sm">
          <Link className="inline-flex min-h-11 items-center px-3 text-[#163D38] hover:text-[#B79A63]" href="/">
            VABIX
          </Link>
          <Link className="inline-flex min-h-11 items-center px-3 text-[#163D38] hover:text-[#B79A63]" href={bizcarPath.home}>
            Giới thiệu
          </Link>
          {user ? (
            <>
              <Link className="inline-flex min-h-11 items-center px-3 text-[#163D38] hover:text-[#B79A63]" href={bizcarPath.dashboard}>
                Dashboard
              </Link>
              <Link className="inline-flex min-h-11 items-center px-3 text-[#163D38] hover:text-[#B79A63]" href={bizcarPath.assessments}>
                Đánh giá
              </Link>
              {isAcademicAdmin(user.access) || isPlatformAdmin(user.access) ? (
                <Link className="inline-flex min-h-11 items-center px-3 text-[#163D38] hover:text-[#B79A63]" href={bizcarPath.admin}>
                  Admin
                </Link>
              ) : null}
              <span className="hidden text-xs text-[#626D68] lg:inline">{user.name}</span>
              <form action={logoutAction}>
                <button className="inline-flex min-h-11 items-center px-3 text-[#163D38] hover:text-[#B79A63]" type="submit">
                  Đăng xuất
                </button>
              </form>
            </>
          ) : (
            <Link className="inline-flex min-h-11 items-center bg-[#163c3e] px-4 font-semibold text-[#F6F5F1]" href={bizcarPath.login}>
              Đăng nhập
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

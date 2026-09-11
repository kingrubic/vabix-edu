"use client";

import { useActionState } from "react";
import Link from "next/link";
import { activateAccountAction, resetPasswordAction } from "@/platform/auth/actions";
import { Logo } from "@/components/brand/Logo";

export function ResetForm({ token, activate }: { token: string; activate: boolean }) {
  const [state, formAction, pending] = useActionState(activate ? activateAccountAction : resetPasswordAction, null);
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5">
      <Logo variant="light" className="h-10" />
      <h1 className="mt-8 text-2xl font-semibold text-[#163c3e]">{activate ? "Kích hoạt tài khoản" : "Đặt lại mật khẩu"}</h1>
      {state && "ok" in state && state.ok ? (
        <p className="mt-4 text-sm">
          Đã lưu mật khẩu.{" "}
          <Link href="/dang-nhap" className="underline">
            Đăng nhập
          </Link>
        </p>
      ) : (
        <form action={formAction} className="mt-6 space-y-4">
          <input type="hidden" name="token" value={token} />
          {activate ? (
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium">Họ tên</span>
              <input className="input" name="name" />
            </label>
          ) : null}
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium">Mật khẩu mới</span>
            <input className="input" type="password" name="password" minLength={10} required />
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium">Xác nhận mật khẩu</span>
            <input className="input" type="password" name="confirm" minLength={10} required />
          </label>
          {state && "error" in state && state.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
          <button type="submit" disabled={pending} className="min-h-11 w-full bg-[#163c3e] text-white">
            {pending ? "Đang lưu…" : "Lưu mật khẩu"}
          </button>
        </form>
      )}
    </div>
  );
}

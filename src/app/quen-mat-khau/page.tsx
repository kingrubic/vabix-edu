"use client";

import { useActionState } from "react";
import Link from "next/link";
import { requestPasswordResetAction } from "@/platform/auth/actions";
import { Logo } from "@/components/brand/Logo";

export default function ForgotPage() {
  const [state, action, pending] = useActionState(requestPasswordResetAction, null);
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5">
      <Logo variant="light" className="h-10" />
      <h1 className="mt-8 text-2xl font-semibold text-[#163c3e]">Quên mật khẩu</h1>
      <p className="mt-2 text-sm text-[#66746f]">
        Nhập email. Hệ thống không cho biết email có tồn tại hay không.
      </p>
      <form action={action} className="mt-6 space-y-4">
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Email</span>
          <input className="input" type="email" name="email" required />
        </label>
        <button type="submit" disabled={pending} className="min-h-11 w-full bg-[#163c3e] text-white disabled:opacity-60">
          {pending ? "Đang xử lý…" : "Gửi hướng dẫn"}
        </button>
      </form>
      {state?.message ? <p className="mt-4 text-sm text-[#16332b]">{state.message}</p> : null}
      <Link href="/dang-nhap" className="mt-6 text-sm underline-offset-2 hover:underline">
        Quay lại đăng nhập
      </Link>
    </div>
  );
}

"use client";

import { useActionState, useState } from "react";
import { changeOwnPasswordAction, platformLogoutAction } from "@/platform/auth/actions";
import { Logo } from "@/components/brand/Logo";

export function ChangePasswordForm({ name }: { name: string }) {
  const [state, action, pending] = useActionState(changeOwnPasswordAction, null);
  const [show, setShow] = useState(false);

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5">
      <Logo variant="light" className="h-10" />
      <h1 className="mt-8 text-2xl font-semibold text-[#163c3e]">Đổi mật khẩu lần đầu</h1>
      <p className="mt-2 text-sm text-[#66746f]">
        Xin chào {name}. Bạn đang dùng mật khẩu tạm. Hãy đặt mật khẩu mới (tối thiểu 10 ký tự) trước
        khi vào hệ thống.
      </p>
      <form action={action} className="mt-6 space-y-4">
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Mật khẩu tạm hiện tại</span>
          <input className="input" type={show ? "text" : "password"} name="current" autoComplete="current-password" required />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Mật khẩu mới</span>
          <input className="input" type={show ? "text" : "password"} name="password" minLength={10} autoComplete="new-password" required />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Xác nhận mật khẩu mới</span>
          <input className="input" type={show ? "text" : "password"} name="confirm" minLength={10} autoComplete="new-password" required />
        </label>
        <button type="button" className="text-sm text-[#163c3e]" onClick={() => setShow((v) => !v)}>
          {show ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
        </button>
        {state?.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
        <button type="submit" disabled={pending} className="min-h-11 w-full bg-[#163c3e] text-white disabled:opacity-60">
          {pending ? "Đang lưu…" : "Lưu mật khẩu mới"}
        </button>
      </form>
      <form action={platformLogoutAction} className="mt-6">
        <button type="submit" className="text-sm text-[#66746f] underline-offset-2 hover:underline">
          Đăng xuất
        </button>
      </form>
    </div>
  );
}

"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { platformLoginAction } from "@/platform/auth/actions";

export function LoginScreen({ next = "" }: { next?: string }) {
  const [state, action, pending] = useActionState(platformLoginAction, null);
  const [show, setShow] = useState(false);

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <section className="relative hidden bg-[#163c3e] px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between">
        <Logo variant="dark" className="h-12" />
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-[#e4b862]">VABIX</p>
          <h1 className="mt-4 max-w-md text-4xl font-semibold leading-tight">Kết tri thức. Nối giá trị.</h1>
          <p className="mt-4 max-w-md text-white/75">
            Không gian quản trị, giảng dạy và học tập dành cho đội ngũ vận hành và học viên các chương trình VABIX.
          </p>
        </div>
        <p className="text-sm text-white/55">Công ty Cổ phần VABIX</p>
      </section>
      <section className="flex items-center justify-center bg-[#f8f5ed] px-5 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden">
            <Logo variant="light" className="h-10" />
            <p className="mt-4 text-[#163c3e]">Kết tri thức. Nối giá trị.</p>
          </div>
          <h2 className="mt-8 text-2xl font-semibold text-[#163c3e]">Đăng nhập</h2>
          <p className="mt-2 text-sm text-[#66746f]">Dùng email được cấp. Không mở đăng ký công khai.</p>
          <form action={action} className="mt-8 space-y-4">
            <input type="hidden" name="next" value={next} />
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium text-[#163c3e]">Email</span>
              <input className="input" type="email" name="email" autoComplete="username" required />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium text-[#163c3e]">Mật khẩu</span>
              <div className="flex gap-2">
                <input className="input" type={show ? "text" : "password"} name="password" autoComplete="current-password" required />
                <button type="button" className="shrink-0 px-3 text-sm text-[#163c3e]" onClick={() => setShow((v) => !v)}>
                  {show ? "Ẩn" : "Hiện"}
                </button>
              </div>
            </label>
            {state?.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
            <button
              type="submit"
              disabled={pending}
              className="inline-flex min-h-11 w-full items-center justify-center bg-[#163c3e] px-5 text-sm font-semibold text-white disabled:opacity-60"
            >
              {pending ? "Đang đăng nhập…" : "Đăng nhập"}
            </button>
          </form>
          <p className="mt-4 text-sm">
            <Link href="/quen-mat-khau" className="text-[#163c3e] underline-offset-2 hover:underline">
              Quên mật khẩu
            </Link>
          </p>
          <p className="mt-8 text-sm text-[#66746f]">
            <Link href="/vabix" className="underline-offset-2 hover:underline">
              Về website VABIX
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}

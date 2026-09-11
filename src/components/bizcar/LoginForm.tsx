"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { loginAction } from "@/features/auth/actions";
import { bizcarPath } from "@/lib/bizcarPaths";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, null);
  const search = useSearchParams();
  const next = search.get("next") ?? bizcarPath.dashboard;
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      <label className="block text-[11px] tracking-[0.12em] text-[#626D68] uppercase">
        Email
        <input
          className="mt-1 w-full min-h-11 border border-[#DDE3DE] bg-white px-3 text-[#163D38]"
          name="email"
          type="email"
          autoComplete="username"
          required
          defaultValue="ceo@demo.vabix.edu.vn"
        />
      </label>
      <label className="block text-[11px] tracking-[0.12em] text-[#626D68] uppercase">
        Mật khẩu
        <input
          className="mt-1 w-full min-h-11 border border-[#DDE3DE] bg-white px-3 text-[#163D38]"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </label>
      {state?.error ? <p className="text-sm text-[#c45c4a]">{state.error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-11 w-full items-center justify-center bg-[#163c3e] font-semibold text-[#F6F5F1] disabled:opacity-60"
      >
        {pending ? "Đang xác thực…" : "Vào không gian làm việc"}
      </button>
    </form>
  );
}

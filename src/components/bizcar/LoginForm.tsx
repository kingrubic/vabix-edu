"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { loginAction } from "@/features/auth/actions";
import { bizcarPath } from "@/lib/bizcarPaths";
import { Field, PrimaryButton } from "./Ui";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, null);
  const search = useSearchParams();
  const next = search.get("next") ?? bizcarPath.dashboard;
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      <Field label="Email">
        <input className="bizcar-input" name="email" type="email" autoComplete="username" required />
      </Field>
      <Field label="Mật khẩu">
        <input className="bizcar-input" name="password" type="password" autoComplete="current-password" required />
      </Field>
      {state?.error ? <p className="text-sm text-amber-200">{state.error}</p> : null}
      <PrimaryButton disabled={pending}>{pending ? "Đang xác thực…" : "Vào không gian làm việc"}</PrimaryButton>
    </form>
  );
}

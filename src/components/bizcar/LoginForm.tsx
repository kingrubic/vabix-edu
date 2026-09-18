"use client";

import { useActionState, useState } from "react";
import { useSearchParams } from "next/navigation";
import { loginAction } from "@/features/auth/actions";
import type { DemoAccount } from "@/db/demoAccounts";
import { bizcarPath } from "@/lib/bizcarPaths";
import { Field, PrimaryButton } from "./Ui";

export function LoginForm({
  demoPassword,
  demoAccounts,
}: {
  demoPassword: string;
  demoAccounts: readonly DemoAccount[];
}) {
  const [state, action, pending] = useActionState(loginAction, null);
  const search = useSearchParams();
  const next = search.get("next") ?? bizcarPath.dashboard;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      <form action={action} className="space-y-4">
        <input type="hidden" name="next" value={next} />
        <Field label="Email">
          <input
            className="bizcar-input"
            name="email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </Field>
        <Field label="Mật khẩu">
          <input
            className="bizcar-input"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </Field>
        {state?.error ? <p className="text-sm text-amber-200">{state.error}</p> : null}
        <PrimaryButton disabled={pending}>{pending ? "Đang xác thực…" : "Vào không gian làm việc"}</PrimaryButton>
      </form>
      <div className="mt-6 text-xs text-white/50">
        <p>Tài khoản minh họa (mật khẩu demo công khai):</p>
        <p className="mt-1 text-[11px] text-white/40">Nhấn một tài khoản để điền email và mật khẩu.</p>
        <ul className="mt-2 space-y-1">
          {demoAccounts.map((account) => (
            <li key={account.email}>
              <button
                type="button"
                className="w-full rounded-sm px-1 py-1 text-left leading-snug text-white/55 transition hover:bg-white/5 hover:text-vabix-gold"
                onClick={() => {
                  setEmail(account.email);
                  setPassword(demoPassword);
                }}
              >
                <span>{account.email}</span>
                <span className="text-white/40"> — {account.role} — </span>
                <span className="font-medium tracking-wide text-vabix-gold/90">{demoPassword}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

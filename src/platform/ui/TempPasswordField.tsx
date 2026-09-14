"use client";

import { useEffect, useState } from "react";
import { resetTempPasswordForm } from "@/platform/ui/actions";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";

function generateTempPassword() {
  const bytes = new Uint32Array(12);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (n) => ALPHABET[n % ALPHABET.length]).join("");
}

export function TempPasswordField({
  required = false,
  compact = false,
  autoGenerate = false,
  label = "Mật khẩu tạm",
  help,
}: {
  required?: boolean;
  compact?: boolean;
  autoGenerate?: boolean;
  label?: string;
  help?: string;
}) {
  const [value, setValue] = useState("");
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!autoGenerate) return;
    setValue(generateTempPassword());
    setShow(true);
  }, [autoGenerate]);

  async function copy() {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className={compact ? "text-sm" : "text-sm md:col-span-2"}>
      {compact ? null : <span className="block">{label}</span>}
      {help ? <p className="mt-1 text-xs text-[#66746f]">{help}</p> : null}
      <div className={`${compact ? "" : "mt-1"} flex flex-wrap gap-2`}>
        <input
          className="input min-w-[10rem] flex-1"
          type={show ? "text" : "password"}
          name="tempPassword"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          minLength={10}
          required={required}
          autoComplete="new-password"
          placeholder="Tối thiểu 10 ký tự"
        />
        <button type="button" className="shrink-0 px-3 text-sm text-[#163c3e]" onClick={() => setShow((v) => !v)}>
          {show ? "Ẩn" : "Hiện"}
        </button>
        <button
          type="button"
          className="shrink-0 border border-[#163c3e] px-3 text-sm text-[#163c3e]"
          onClick={() => {
            setValue(generateTempPassword());
            setShow(true);
            setCopied(false);
          }}
        >
          Tạo ngẫu nhiên
        </button>
        <button
          type="button"
          className="shrink-0 px-3 text-sm text-[#163c3e] disabled:opacity-40"
          onClick={() => void copy()}
          disabled={!value}
        >
          {copied ? "Đã chép" : "Chép"}
        </button>
      </div>
    </div>
  );
}

export function ResetTempPasswordForm({ userId }: { userId: string }) {
  return (
    <form action={resetTempPasswordForm} className="flex min-w-[22rem] flex-col gap-2">
      <input type="hidden" name="userId" value={userId} />
      <TempPasswordField compact required />
      <button className="self-start bg-[#163c3e] px-3 py-1.5 text-xs font-medium text-white">Đặt mật khẩu tạm</button>
    </form>
  );
}

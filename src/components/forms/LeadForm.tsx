"use client";

import { useMemo, useState } from "react";
import { siteConfig } from "@/lib/siteConfig";
import type { LeadType } from "@/lib/leads";
import { needsForLeadType } from "@/content/leadNeeds";
import { Button } from "@/components/ui/Button";

const sizes = ["Dưới 20 người", "20–50", "51–200", "Trên 200"];

export function LeadForm({
  type = "consult",
  title,
  eventSlug,
  program,
}: {
  type?: LeadType;
  title?: string;
  eventSlug?: string;
  program?: string;
}) {
  const started = useMemo(() => Date.now(), []);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const needs = needsForLeadType(type);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    const fd = new FormData(e.currentTarget);
    const payload = {
      type,
      name: String(fd.get("name") ?? ""),
      company: String(fd.get("company") ?? ""),
      role: String(fd.get("role") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      email: String(fd.get("email") ?? ""),
      companySize: String(fd.get("companySize") ?? ""),
      need: String(fd.get("need") ?? ""),
      message: String(fd.get("message") ?? ""),
      program: program ?? String(fd.get("program") ?? ""),
      eventSlug,
      consent: fd.get("consent") === "on",
      website: String(fd.get("website") ?? ""),
      elapsedMs: Date.now() - started,
    };
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await res.json()) as { ok: boolean; message?: string };
    if (data.ok) {
      setStatus("success");
      setMessage("Yêu cầu đã được ghi nhận. VABIX sẽ liên hệ trong thời gian sớm nhất.");
      e.currentTarget.reset();
      return;
    }
    setStatus("error");
    setMessage(data.message ?? "Không gửi được yêu cầu.");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      {title ? <h3 className="text-xl font-semibold text-vabix-deep-teal">{title}</h3> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="name" label="Họ tên" required autoComplete="name" />
        <Field name="company" label="Doanh nghiệp" autoComplete="organization" />
        <Field name="role" label="Chức vụ" autoComplete="organization-title" />
        <Field name="phone" label="Số điện thoại" type="tel" required autoComplete="tel" />
        <Field name="email" label="Email" type="email" required autoComplete="email" />
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium text-vabix-deep-teal">Quy mô doanh nghiệp</span>
          <select name="companySize" className="input">
            <option value="">Chọn quy mô</option>
            {sizes.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm sm:col-span-2">
          <span className="mb-1.5 block font-medium text-vabix-deep-teal">Nhu cầu</span>
          <select name="need" className="input">
            <option value="">Chọn nhu cầu</option>
            {needs.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm sm:col-span-2">
          <span className="mb-1.5 block font-medium text-vabix-deep-teal">Nội dung cần trao đổi</span>
          <textarea name="message" rows={4} className="input min-h-[120px]" />
        </label>
      </div>
      <div className="hidden" aria-hidden>
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <label className="flex items-start gap-2 text-sm text-vabix-muted">
        <input type="checkbox" name="consent" className="mt-1" required />
        <span>
          Tôi đồng ý với{" "}
          <a className="underline" href="/chinh-sach-quyen-rieng-tu">
            chính sách quyền riêng tư
          </a>{" "}
          và việc VABIX lưu trữ, bảo mật và liên hệ về yêu cầu này. Thông tin không được dùng để chào bán một chiều.
        </span>
      </label>
      {message ? (
        <p className={`text-sm ${status === "success" ? "text-vabix-forest" : "text-red-800"}`} role="status">
          {message}
        </p>
      ) : null}
      {status === "error" ? (
        <p className="text-sm text-vabix-muted">
          Hoặc gọi{" "}
          <a href={siteConfig.contact.hotlineHref} className="font-semibold text-vabix-deep-teal">
            {siteConfig.contact.hotline}
          </a>{" "}
          / email{" "}
          <a href={siteConfig.contact.emailHref} className="font-semibold text-vabix-deep-teal">
            {siteConfig.contact.email}
          </a>
          .
        </p>
      ) : null}
      <Button type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Đang gửi..." : "Gửi yêu cầu"}
      </Button>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
  autoComplete,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-medium text-vabix-deep-teal">
        {label}
        {required ? " *" : ""}
      </span>
      <input name={name} type={type} required={required} autoComplete={autoComplete} className="input" />
    </label>
  );
}

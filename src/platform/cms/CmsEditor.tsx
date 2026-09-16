"use client";

import { useMemo, useState } from "react";
import { saveCmsForm } from "@/platform/ui/actions";

type Doc = {
  id: string;
  type: string;
  slug: string;
  title: string;
  status: string;
  payload: string;
  seo: string;
  internal_notes: string;
  version: number;
};

function asRecord(raw: string): Record<string, unknown> {
  try {
    const parsed = JSON.parse(raw) as unknown;
    return parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

function lines(value: unknown) {
  return Array.isArray(value) ? value.map(String).join("\n") : "";
}

export function CmsEditor({ doc }: { doc: Doc }) {
  const initial = useMemo(() => asRecord(doc.payload), [doc.payload]);
  const [payloadJson, setPayloadJson] = useState(() => JSON.stringify(initial, null, 2));
  const [advanced, setAdvanced] = useState(false);

  function syncFromForm(form: HTMLFormElement) {
    const fd = new FormData(form);
    const next = { ...asRecord(payloadJson) };
    for (const [key, value] of fd.entries()) {
      if (!key.startsWith("field.")) continue;
      const name = key.slice("field.".length);
      const text = String(value);
      if (name.endsWith("List") || ["objectives", "topics", "deliverables", "outcomes", "whoFor", "relatedPrograms", "relatedModels", "audienceList"].includes(name)) {
        next[name] = text.split("\n").map((item) => item.trim()).filter(Boolean);
      } else if (name === "featured" || name === "registrationOpen") {
        next[name] = text === "on" || text === "true";
      } else {
        next[name] = text;
      }
    }
    const serialized = JSON.stringify(next, null, 2);
    setPayloadJson(serialized);
    const hidden = form.querySelector<HTMLTextAreaElement>('textarea[name="payload"]');
    if (hidden) hidden.value = serialized;
  }

  return (
    <form
      action={saveCmsForm}
      className="platform-card space-y-4 p-6"
      onSubmit={(event) => syncFromForm(event.currentTarget)}
    >
      <input type="hidden" name="id" value={doc.id} />
      <input type="hidden" name="type" value={doc.type} />
      <input type="hidden" name="expectedVersion" value={doc.version} />
      <h1 className="text-2xl font-semibold text-[#163c3e]">Sửa: {doc.title}</h1>
      <label className="block text-sm">
        Tiêu đề
        <input className="input mt-1" name="title" defaultValue={doc.title} />
      </label>
      <label className="block text-sm">
        Slug
        <input className="input mt-1" name="slug" defaultValue={doc.slug} />
      </label>
      {doc.type === "program" ? (
        <div className="grid gap-3 md:grid-cols-2">
          <Field name="shortTitle" label="Tên ngắn" defaultValue={String(initial.shortTitle ?? "")} />
          <Field name="tagline" label="Tagline" defaultValue={String(initial.tagline ?? "")} />
          <Field name="group" label="Nhóm (ceo / management / custom)" defaultValue={String(initial.group ?? "")} />
          <Field name="duration" label="Thời lượng" defaultValue={String(initial.duration ?? "")} />
          <label className="block text-sm md:col-span-2">
            Mô tả ngắn
            <textarea className="input mt-1 min-h-24" name="field.shortDescription" defaultValue={String(initial.shortDescription ?? "")} />
          </label>
          <label className="block text-sm md:col-span-2">
            Bài toán
            <textarea className="input mt-1 min-h-24" name="field.problem" defaultValue={String(initial.problem ?? "")} />
          </label>
          <label className="block text-sm md:col-span-2">
            Mục tiêu (mỗi dòng một ý)
            <textarea className="input mt-1 min-h-24" name="field.objectives" defaultValue={lines(initial.objectives)} />
          </label>
          <label className="block text-sm md:col-span-2">
            Nội dung / chuyên đề
            <textarea className="input mt-1 min-h-24" name="field.topics" defaultValue={lines(initial.topics)} />
          </label>
          <label className="block text-sm md:col-span-2">
            Kết quả hướng đến
            <textarea className="input mt-1 min-h-24" name="field.outcomes" defaultValue={lines(initial.outcomes)} />
          </label>
          <label className="block text-sm md:col-span-2">
            Lưu ý pháp lý / clarification
            <textarea className="input mt-1 min-h-20" name="field.clarification" defaultValue={String(initial.clarification ?? "")} />
          </label>
          <Field name="certificate" label="Chứng nhận" defaultValue={String(initial.certificate ?? "")} />
          <Field name="seoDescription" label="SEO description" defaultValue={String(initial.seoDescription ?? "")} />
        </div>
      ) : null}
      {doc.type === "methodology" ? (
        <div className="grid gap-3">
          <Field name="name" label="Tên" defaultValue={String(initial.name ?? "")} />
          <Field name="shortName" label="Tên ngắn" defaultValue={String(initial.shortName ?? "")} />
          <Field name="eyebrow" label="Eyebrow" defaultValue={String(initial.eyebrow ?? "")} />
          <Field name="headline" label="Headline" defaultValue={String(initial.headline ?? "")} />
          <label className="block text-sm">
            Tóm tắt
            <textarea className="input mt-1 min-h-24" name="field.summary" defaultValue={String(initial.summary ?? "")} />
          </label>
          <label className="block text-sm">
            Mô tả
            <textarea className="input mt-1 min-h-32" name="field.description" defaultValue={String(initial.description ?? "")} />
          </label>
        </div>
      ) : null}
      {doc.type === "article" ? (
        <div className="grid gap-3">
          <label className="block text-sm">
            Tóm tắt
            <textarea className="input mt-1 min-h-20" name="field.excerpt" defaultValue={String(initial.excerpt ?? "")} />
          </label>
          <label className="block text-sm">
            Nội dung
            <textarea className="input mt-1 min-h-48" name="field.content" defaultValue={String(initial.content ?? "")} />
          </label>
          <Field name="author" label="Tác giả" defaultValue={String(initial.author ?? "")} />
          <Field name="publishedAt" label="Ngày xuất bản" defaultValue={String(initial.publishedAt ?? "")} />
        </div>
      ) : null}
      {doc.type === "page" ? (
        <div className="grid gap-3">
          <Field name="heroHeadline" label="Hero headline" defaultValue={String(initial.heroHeadline ?? "")} />
          <label className="block text-sm">
            Hero supporting
            <textarea className="input mt-1 min-h-24" name="field.heroSubheadline" defaultValue={String(initial.heroSubheadline ?? "")} />
          </label>
          <Field name="founderTitle" label="Chức danh nhà sáng lập" defaultValue={String(initial.founderTitle ?? "")} />
          <label className="block text-sm">
            Sứ mệnh
            <textarea className="input mt-1 min-h-24" name="field.mission" defaultValue={String(initial.mission ?? "")} />
          </label>
        </div>
      ) : null}
      <textarea name="payload" className={advanced ? "input mt-1 min-h-64 font-mono text-sm" : "hidden"} value={payloadJson} onChange={(e) => setPayloadJson(e.target.value)} />
      <button type="button" className="text-sm underline" onClick={() => setAdvanced((v) => !v)}>
        {advanced ? "Ẩn JSON nâng cao" : "Hiện JSON nâng cao"}
      </button>
      <label className="block text-sm">
        SEO JSON
        <textarea className="input mt-1 font-mono text-sm" name="seo" defaultValue={doc.seo} />
      </label>
      <label className="block text-sm">
        Ghi chú nội bộ
        <textarea className="input mt-1" name="internalNotes" defaultValue={doc.internal_notes} />
      </label>
      <label className="block text-sm">
        Trạng thái
        <select className="input mt-1" name="status" defaultValue={doc.status}>
          <option value="draft">Nháp</option>
          <option value="pending_review">Chờ duyệt</option>
          <option value="published">Xuất bản</option>
          <option value="archived">Lưu trữ</option>
        </select>
      </label>
      <p className="text-xs text-[#66746f]">Ghi chú nội bộ không xuất hiện trên website. Không chèn JavaScript. Phiên bản hiện tại: {doc.version}.</p>
      <div className="flex flex-wrap gap-3">
        <button className="bg-[#163c3e] px-4 py-2 text-white">Lưu</button>
      </div>
    </form>
  );
}

function Field({ name, label, defaultValue }: { name: string; label: string; defaultValue: string }) {
  return (
    <label className="block text-sm">
      {label}
      <input className="input mt-1" name={`field.${name}`} defaultValue={defaultValue} />
    </label>
  );
}

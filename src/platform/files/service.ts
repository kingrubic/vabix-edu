import fs from "node:fs";
import path from "node:path";
import { getDb, nowIso, newId } from "@/platform/db/client";
import type { Actor } from "@/platform/permissions/evaluate";

const ROOT = path.join(process.cwd(), "data", "uploads");
const MAX_BYTES = 20 * 1024 * 1024;
const ALLOWED: Record<string, string[]> = {
  public: ["image/jpeg", "image/png", "image/webp", "application/pdf"],
  class: ["image/jpeg", "image/png", "application/pdf", "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation"],
  submission: ["application/pdf", "image/jpeg", "image/png", "application/zip"],
  task: ["application/pdf", "image/jpeg", "image/png"],
  profile: ["image/jpeg", "image/png", "image/webp"],
  internal: ["application/pdf", "image/jpeg", "image/png"],
};

export function saveUpload(input: {
  actor: Actor;
  file: { name: string; type: string; bytes: Buffer };
  visibility: keyof typeof ALLOWED;
  classId?: string | null;
  altText?: string;
  usedAs?: string;
}) {
  if (input.file.bytes.length > MAX_BYTES) throw new Error("Tệp vượt quá 20MB.");
  const allowed = ALLOWED[input.visibility] ?? ALLOWED.internal;
  if (!allowed.includes(input.file.type)) throw new Error("Định dạng tệp không được phép.");
  fs.mkdirSync(ROOT, { recursive: true });
  const id = newId();
  const ext = path.extname(input.file.name).slice(0, 8);
  const stored = `${id}${ext}`;
  fs.writeFileSync(path.join(ROOT, stored), input.file.bytes);
  getDb()
    .prepare(
      `INSERT INTO files (id, original_name, stored_name, mime, size_bytes, visibility, owner_user_id, class_id, alt_text, used_as, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      id,
      input.file.name,
      stored,
      input.file.type,
      input.file.bytes.length,
      input.visibility,
      input.actor.id,
      input.classId ?? null,
      input.altText ?? "",
      input.usedAs ?? "",
      nowIso(),
    );
  return id;
}

export function fileRecord(id: string) {
  return getDb().prepare(`SELECT * FROM files WHERE id=?`).get(id) as
    | {
        id: string;
        stored_name: string;
        original_name: string;
        mime: string;
        visibility: string;
        owner_user_id: string | null;
        class_id: string | null;
      }
    | undefined;
}

export function readFileAuthorized(actor: Actor | null, id: string) {
  const row = fileRecord(id);
  if (!row) return null;
  if (row.visibility === "public") return row;
  if (!actor) return null;
  if (actor.role === "admin" || actor.role === "mod") return row;
  if (row.visibility === "profile" && row.owner_user_id === actor.id) return row;
  if (row.class_id && actor.assignedClassIds.includes(row.class_id)) return row;
  if (row.owner_user_id === actor.id) return row;
  return null;
}

export function filePath(storedName: string) {
  return path.join(ROOT, storedName);
}

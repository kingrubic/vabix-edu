import { getDb, nowIso, newId, tx } from "@/platform/db/client";
import { parseJson, sanitizeHtml } from "@/platform/sanitize";
import { writeAudit } from "@/platform/audit";
import { assertCan, type Actor } from "@/platform/permissions/evaluate";
import { revalidatePath, revalidateTag } from "next/cache";

export type CmsStatus = "draft" | "pending_review" | "published" | "archived";

export type CmsDocument = {
  id: string;
  type: string;
  slug: string;
  title: string;
  status: CmsStatus;
  payload: string;
  seo: string;
  internal_notes: string;
  featured: number;
  sort_order: number;
  published_at: string | null;
  version: number;
  origin: string;
  updated_at: string;
};

const MENU_BY_TYPE: Record<string, string> = {
  page: "website.pages",
  nav: "website.nav",
  footer: "website.nav",
  solution: "website.solutions",
  program: "website.programs",
  methodology: "website.models",
  expert: "website.experts",
  partner: "website.partners",
  village: "website.partners",
  article: "website.articles",
  case_study: "website.articles",
  event: "website.events",
  knowledge_product: "website.products",
  workforce: "website.workforce",
  policy: "website.pages",
  redirect: "website.seo",
};

export function menuForCmsType(type: string) {
  return MENU_BY_TYPE[type] ?? "website.pages";
}

export function listCms(type: string, includeInternal = false) {
  const rows = getDb()
    .prepare(`SELECT * FROM cms_documents WHERE type = ? ORDER BY sort_order, title`)
    .all(type) as CmsDocument[];
  if (includeInternal) return rows;
  return rows.map((row) => ({ ...row, internal_notes: "" }));
}

export function getCms(type: string, slug: string) {
  return (getDb().prepare(`SELECT * FROM cms_documents WHERE type = ? AND slug = ?`).get(type, slug) as CmsDocument | undefined) ?? null;
}

export function getCmsById(id: string) {
  return (getDb().prepare(`SELECT * FROM cms_documents WHERE id = ?`).get(id) as CmsDocument | undefined) ?? null;
}

export function listPublishedCms(type: string) {
  return getDb()
    .prepare(`SELECT * FROM cms_documents WHERE type = ? AND status = 'published' ORDER BY sort_order, title`)
    .all(type) as CmsDocument[];
}

function revalidatePublic(type: string, slug: string) {
  revalidateTag("cms");
  const paths: Record<string, string[]> = {
    page: slug === "home" ? ["/vabix"] : [`/${slug}`],
    program: ["/chuong-trinh", `/chuong-trinh/${slug}`],
    methodology: ["/mo-hinh-phuong-phap", `/mo-hinh-phuong-phap/${slug}`],
    expert: ["/mang-luoi/chuyen-gia", `/mang-luoi/chuyen-gia/${slug}`],
    article: ["/tri-thuc", `/tri-thuc/${slug}`],
    case_study: ["/tri-thuc/case-study", `/tri-thuc/case-study/${slug}`],
    event: ["/su-kien", `/su-kien/${slug}`],
    knowledge_product: ["/san-pham-tri-thuc", `/san-pham-tri-thuc/${slug}`],
    solution: ["/giai-phap", `/giai-phap/${slug}`],
  };
  for (const path of paths[type] ?? []) {
    revalidatePath(path);
  }
}

export function saveCms(
  actor: Actor,
  input: {
    id?: string;
    type: string;
    slug: string;
    title: string;
    status: CmsStatus;
    payload: Record<string, unknown>;
    seo?: Record<string, unknown>;
    internalNotes?: string;
    featured?: boolean;
    expectedVersion?: number;
  },
) {
  const menu = menuForCmsType(input.type);
  const action = input.id ? "update" : "create";
  assertCan(actor, menu, action);
  if (input.status === "published" || input.status === "archived") {
    assertCan(actor, menu, input.status === "published" ? "approve" : "soft_delete");
  }
  const at = nowIso();
  const payload = JSON.stringify(input.payload);
  const seo = JSON.stringify(input.seo ?? {});
  const notes = input.internalNotes ?? "";
  return tx((db) => {
    if (input.id) {
      const current = db.prepare(`SELECT * FROM cms_documents WHERE id = ?`).get(input.id) as CmsDocument | undefined;
      if (!current) throw new Error("Không tìm thấy bản ghi.");
      if (input.expectedVersion && current.version !== input.expectedVersion) {
        throw new Error("Bản ghi đã được người khác sửa. Tải lại trước khi lưu.");
      }
      const version = current.version + 1;
      db.prepare(
        `INSERT INTO cms_document_versions (id, document_id, version, status, title, payload, seo, internal_notes, created_at, created_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ).run(newId(), current.id, current.version, current.status, current.title, current.payload, current.seo, current.internal_notes, at, actor.id);
      db.prepare(
        `UPDATE cms_documents SET slug=?, title=?, status=?, payload=?, seo=?, internal_notes=?, featured=?, published_at=?, published_by=?, version=?, updated_at=?, updated_by=?, archived_at=? WHERE id=?`,
      ).run(
        input.slug,
        input.title,
        input.status,
        payload,
        seo,
        notes,
        input.featured ? 1 : 0,
        input.status === "published" ? current.published_at ?? at : current.published_at,
        input.status === "published" ? actor.id : current.published_at,
        version,
        at,
        actor.id,
        input.status === "archived" ? at : null,
        input.id,
      );
      writeAudit({ actorUserId: actor.id, action: "cms.update", entityType: input.type, entityId: input.id, summary: `Cập nhật ${input.title}.` });
      if (input.status === "published") revalidatePublic(input.type, input.slug);
      return input.id;
    }
    const id = newId();
    db.prepare(
      `INSERT INTO cms_documents (id, type, slug, title, status, payload, seo, internal_notes, featured, sort_order, published_at, published_by, version, origin, is_seed, created_at, updated_at, created_by, updated_by, archived_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, 1, 'cms', 0, ?, ?, ?, ?, NULL)`,
    ).run(
      id,
      input.type,
      input.slug,
      input.title,
      input.status,
      payload,
      seo,
      notes,
      input.featured ? 1 : 0,
      input.status === "published" ? at : null,
      input.status === "published" ? actor.id : null,
      at,
      at,
      actor.id,
      actor.id,
    );
    writeAudit({ actorUserId: actor.id, action: "cms.create", entityType: input.type, entityId: id, summary: `Tạo ${input.title}.` });
    if (input.status === "published") revalidatePublic(input.type, input.slug);
    return id;
  });
}

export function restoreCmsVersion(actor: Actor, documentId: string, version: number) {
  const doc = getCmsById(documentId);
  if (!doc) throw new Error("Không tìm thấy bản ghi.");
  assertCan(actor, menuForCmsType(doc.type), "update");
  const snap = getDb()
    .prepare(`SELECT * FROM cms_document_versions WHERE document_id = ? AND version = ?`)
    .get(documentId, version) as { payload: string; seo: string; title: string; status: string } | undefined;
  if (!snap) throw new Error("Không tìm thấy phiên bản.");
  return saveCms(actor, {
    id: documentId,
    type: doc.type,
    slug: doc.slug,
    title: snap.title,
    status: "draft",
    payload: parseJson(snap.payload, {}),
    seo: parseJson(snap.seo, {}),
    expectedVersion: doc.version,
  });
}

export function publicPayload<T extends Record<string, unknown>>(doc: CmsDocument): T {
  const payload = parseJson<Record<string, unknown>>(doc.payload, {});
  const sanitized = { ...payload };
  if (typeof sanitized.content === "string") sanitized.content = sanitizeHtml(sanitized.content);
  if (typeof sanitized.body === "string") sanitized.body = sanitizeHtml(sanitized.body);
  const featured = Boolean(doc.featured) || Boolean(sanitized.featured);
  return { ...sanitized, slug: doc.slug, title: doc.title, featured } as unknown as T;
}

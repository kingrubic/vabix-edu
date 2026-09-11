import { getDb, nowIso, newId } from "@/platform/db/client";
import { assertCan, type Actor } from "@/platform/permissions/evaluate";
import { completionState } from "./progress";
import { notifyUsers } from "@/platform/notify/service";
import { randomToken } from "@/platform/auth/session";
import { parseJson } from "@/platform/sanitize";

export function ensureCertificateTemplate() {
  const existing = getDb().prepare(`SELECT id FROM lms_certificate_templates LIMIT 1`).get() as { id: string } | undefined;
  if (existing) return existing.id;
  const id = newId();
  getDb()
    .prepare(
      `INSERT OR IGNORE INTO lms_certificate_templates (id, name, payload, version, status, created_at, updated_at)
       VALUES (?, 'Chứng nhận hoàn thành VABIX', ?, 1, 'draft', ?, ?)`,
    )
    .run(
      id,
      JSON.stringify({
        title: "Giấy chứng nhận hoàn thành",
        brand: "VABIX",
        disclaimer: "Chứng nhận chuyên môn do VABIX cấp theo tiêu chuẩn chương trình. Không phải bằng cấp nhà nước.",
        signatureReady: false,
      }),
      nowIso(),
      nowIso(),
    );
  return id;
}

export function issuanceReady() {
  const setting = getDb().prepare(`SELECT value FROM app_settings WHERE key='certificate_ready'`).get() as { value: string } | undefined;
  const template = getDb().prepare(`SELECT payload FROM lms_certificate_templates ORDER BY version DESC LIMIT 1`).get() as
    | { payload: string }
    | undefined;
  const payload = parseJson<{ signatureReady?: boolean }>(template?.payload, {});
  return setting?.value === "true" && payload.signatureReady === true;
}

export function previewCertificate(actor: Actor, enrollmentId: string) {
  assertCan(actor, "lms.certificates", "view");
  const row = getDb()
    .prepare(
      `SELECT e.id, p.full_name, c.name AS class_name, k.name AS course_name, c.starts_on, c.ends_on
       FROM lms_enrollments e
       JOIN learner_profiles p ON p.id = e.learner_profile_id
       JOIN lms_classes c ON c.id = e.class_id
       JOIN lms_courses k ON k.id = c.course_id
       WHERE e.id=?`,
    )
    .get(enrollmentId) as { full_name: string; class_name: string; course_name: string; starts_on: string | null; ends_on: string | null } | undefined;
  if (!row) throw new Error("Không tìm thấy ghi danh.");
  const completion = completionState(enrollmentId);
  return {
    learnerName: row.full_name,
    programName: row.course_name,
    className: row.class_name,
    period: [row.starts_on, row.ends_on].filter(Boolean).join(" — "),
    completion,
    ready: issuanceReady(),
    message: issuanceReady()
      ? "Đủ điều kiện phát hành khi hoàn thành được duyệt."
      : "Chữ ký/con dấu chưa được đơn vị cung cấp. Luồng duyệt đã sẵn sàng nhưng chưa phát hành chính thức.",
  };
}

export function issueCertificate(actor: Actor, enrollmentId: string) {
  assertCan(actor, "lms.certificates", "issue_certificate");
  const completion = completionState(enrollmentId);
  if (!completion.coursePassed) throw new Error("Chưa đủ điều kiện hoàn thành lớp.");
  if (!issuanceReady()) throw new Error("Chưa sẵn sàng phát hành: thiếu chữ ký/con dấu do đơn vị cung cấp.");
  const existing = getDb()
    .prepare(`SELECT id FROM lms_certificates WHERE enrollment_id=? AND status IN ('pending','issued')`)
    .get(enrollmentId) as { id: string } | undefined;
  if (existing) throw new Error("Chứng nhận cho ghi danh này đã tồn tại.");
  const preview = previewCertificate(actor, enrollmentId);
  const templateId = ensureCertificateTemplate();
  const template = getDb().prepare(`SELECT * FROM lms_certificate_templates WHERE id=?`).get(templateId) as { payload: string; version: number };
  const id = newId();
  const code = `VABIX-${new Date().getFullYear()}-${id.slice(0, 8).toUpperCase()}`;
  const token = randomToken();
  getDb()
    .prepare(
      `INSERT INTO lms_certificates (id, enrollment_id, template_id, template_snapshot, code, verify_token, learner_name, program_name, class_name, issued_at, issued_by, status, revoke_reason, pdf_file_id, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'issued', '', NULL, ?)`,
    )
    .run(
      id,
      enrollmentId,
      templateId,
      JSON.stringify({ ...parseJson(template.payload, {}), version: template.version }),
      code,
      token,
      preview.learnerName,
      preview.programName,
      preview.className,
      nowIso(),
      actor.id,
      nowIso(),
    );
  const enrollment = getDb().prepare(`SELECT user_id FROM lms_enrollments WHERE id=?`).get(enrollmentId) as { user_id: string | null };
  if (enrollment.user_id) {
    notifyUsers([enrollment.user_id], {
      type: "certificate",
      title: "Chứng nhận đã được cấp",
      body: preview.programName,
      href: "/hoc-tap/ket-qua",
      refId: id,
    });
  }
  return { id, code, verifyToken: token };
}

export function revokeCertificate(actor: Actor, id: string, reason: string) {
  assertCan(actor, "lms.certificates", "approve");
  getDb().prepare(`UPDATE lms_certificates SET status='revoked', revoke_reason=? WHERE id=?`).run(reason, id);
}

export function publicVerify(token: string) {
  const row = getDb()
    .prepare(`SELECT learner_name, program_name, issued_at, status, code FROM lms_certificates WHERE verify_token=?`)
    .get(token) as { learner_name: string; program_name: string; issued_at: string | null; status: string; code: string } | undefined;
  if (!row) return null;
  return {
    recipient: row.learner_name,
    program: row.program_name,
    issuedAt: row.issued_at,
    status: row.status,
    code: row.code,
  };
}

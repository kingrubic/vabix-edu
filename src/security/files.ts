const ALLOWED_MIME = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
  "text/plain",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
]);

export const MAX_EVIDENCE_BYTES = 8 * 1024 * 1024;

export function assertSafeUpload(file: { type: string; size: number; name: string }): void {
  if (file.size > MAX_EVIDENCE_BYTES) {
    throw new Error("Tệp vượt quá 8MB.");
  }
  if (!ALLOWED_MIME.has(file.type)) {
    throw new Error("Định dạng tệp không được phép.");
  }
  if (file.name.includes("..") || file.name.includes("/") || file.name.includes("\\")) {
    throw new Error("Tên tệp không hợp lệ.");
  }
}

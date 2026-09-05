import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/security/session";
import { getAssessment } from "@/db/repo";
import { canEditAssessment } from "@/security/rbac";
import { assertSafeUpload } from "@/security/files";
import { mutateStore } from "@/db/store";
import { rateLimit } from "@/security/rateLimit";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "UNAUTHENTICATED" }, { status: 401 });
  const limited = rateLimit(`upload:${user.id}`, 20, 60 * 60 * 1000);
  if (!limited.ok) return NextResponse.json({ error: "Quá nhiều tải lên." }, { status: 429 });

  const form = await request.formData();
  const assessmentId = String(form.get("assessmentId") ?? "");
  const assessment = await getAssessment(assessmentId);
  if (!assessment || !canEditAssessment(user.access, assessment)) {
    return NextResponse.json({ error: "Không có quyền." }, { status: 403 });
  }
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Thiếu tệp." }, { status: 400 });
  try {
    assertSafeUpload({ type: file.type, size: file.size, name: file.name });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Tệp không hợp lệ" }, { status: 400 });
  }

  const key = `${assessment.organizationId}/${assessmentId}/${crypto.randomUUID()}-${file.name}`;
  const dest = path.join(process.cwd(), "data", "private-uploads", key);
  await mkdir(path.dirname(dest), { recursive: true });
  await writeFile(dest, Buffer.from(await file.arrayBuffer()));

  await mutateStore((store) => {
    store.evidenceItems.push({
      id: crypto.randomUUID(),
      assessmentId,
      componentCode: null,
      criterionCode: null,
      connectionCode: null,
      title: file.name,
      note: "Tệp lưu trữ riêng — truy xuất qua URL ký thời hạn.",
      linkUrl: null,
      storageKey: key,
      mimeType: file.type,
      fileName: file.name,
      fileSize: file.size,
      kind: "FILE",
      createdAt: new Date().toISOString(),
      createdBy: user.id,
    });
  });

  return NextResponse.json({ ok: true, storageKey: key });
}

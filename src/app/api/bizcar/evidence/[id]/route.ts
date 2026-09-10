import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/security/session";
import { loadStore } from "@/db/store";
import { getAssessment } from "@/db/repo";
import { canViewAssessment } from "@/security/rbac";
import { SignJWT, jwtVerify } from "jose";

function fileSecret() {
  const secret = process.env.AUTH_SECRET || "vabix-bizcar-dev-secret-not-for-production";
  return new TextEncoder().encode(secret);
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "UNAUTHENTICATED" }, { status: 401 });
  const { id } = await params;
  const store = await loadStore();
  const item = store.evidenceItems.find((row) => row.id === id);
  if (!item?.storageKey) return NextResponse.json({ error: "Không tìm thấy." }, { status: 404 });
  const assessment = await getAssessment(item.assessmentId);
  if (!assessment || !canViewAssessment(user.access, assessment)) {
    return NextResponse.json({ error: "Không có quyền." }, { status: 403 });
  }
  const url = new URL(request.url);
  const sig = url.searchParams.get("sig");
  if (!sig) {
    const token = await new SignJWT({ evidenceId: id, sub: user.id })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("2m")
      .sign(fileSecret());
    return NextResponse.json({ url: `/api/bizcar/evidence/${id}?sig=${token}`, expiresIn: 120 });
  }
  try {
    const { payload } = await jwtVerify(sig, fileSecret());
    if (payload.evidenceId !== id || payload.sub !== user.id) throw new Error("bad");
  } catch {
    return NextResponse.json({ error: "Chữ ký hết hạn hoặc không hợp lệ." }, { status: 403 });
  }
  const filePath = path.join(process.cwd(), "data", "private-uploads", item.storageKey);
  const data = await readFile(filePath);
  return new NextResponse(new Uint8Array(data), {
    headers: {
      "Content-Type": item.mimeType ?? "application/octet-stream",
      "Content-Disposition": `attachment; filename="${item.fileName ?? "evidence"}"`,
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

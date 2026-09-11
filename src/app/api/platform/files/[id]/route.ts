import { NextResponse } from "next/server";
import { getPlatformActor } from "@/platform/auth/session";
import { filePath, readFileAuthorized } from "@/platform/files/service";
import { readFileSync } from "node:fs";
import { bootPlatform } from "@/platform/boot";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  await bootPlatform();
  const actor = await getPlatformActor();
  const { id } = await params;
  const row = readFileAuthorized(actor, id);
  if (!row) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const buf = readFileSync(filePath(row.stored_name));
  return new NextResponse(buf, {
    headers: {
      "Content-Type": row.mime,
      "Content-Disposition": `inline; filename="${row.original_name}"`,
      "Cache-Control": "private, max-age=60",
    },
  });
}

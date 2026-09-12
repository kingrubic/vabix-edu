import { NextResponse } from "next/server";
import { bootPlatform } from "@/platform/boot";
import { publicCmsRecord } from "@/platform/cms/catalog";
import { rateLimit } from "@/security/rateLimit";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const limited = rateLimit(`cms-public:${url.pathname}`, 60, 60 * 1000);
  if (!limited.ok) return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  await bootPlatform();
  const type = url.searchParams.get("type") ?? "";
  const slug = url.searchParams.get("slug") ?? "";
  if (!type || !slug) return NextResponse.json({ error: "missing" }, { status: 400 });
  const record = publicCmsRecord(type, slug);
  if (!record) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ ok: true, record });
}

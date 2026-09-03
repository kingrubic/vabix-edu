import { NextResponse } from "next/server";
import { submitLead, type LeadPayload } from "@/lib/leads";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as LeadPayload | null;
  if (!body) {
    return NextResponse.json({ ok: false, message: "Dữ liệu không hợp lệ." }, { status: 400 });
  }
  const result = await submitLead(body);
  const status = result.ok ? 200 : result.code === "VALIDATION" || result.code === "SPAM" ? 400 : 503;
  return NextResponse.json(result, { status });
}

import { NextResponse } from "next/server";
import { bootPlatform } from "@/platform/boot";
import { processDueNotifications } from "@/platform/notify/service";
import { getPlatformActor } from "@/platform/auth/session";

export async function POST(req: Request) {
  await bootPlatform();
  const secret = process.env.PLATFORM_JOB_SECRET;
  const header = req.headers.get("authorization");
  const actor = await getPlatformActor();
  const authorized = (secret && header === `Bearer ${secret}`) || actor?.role === "admin";
  if (!authorized) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const result = processDueNotifications();
  return NextResponse.json({ ok: true, ...result, emailed: false });
}

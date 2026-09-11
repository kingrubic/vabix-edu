import { NextResponse } from "next/server";
import { api, getConvexHttpClient } from "@/lib/convexServer";

export async function GET() {
  const client = getConvexHttpClient();
  if (!client) {
    return NextResponse.json({ ok: false, convex: "missing_url" }, { status: 503 });
  }
  try {
    const ping = await client.query(api.health.ping, {});
    const bizcar = await client.query(api.bizcar.isSeeded, {});
    return NextResponse.json({ ok: true, convex: ping, bizcar });
  } catch (error) {
    return NextResponse.json(
      { ok: false, convex: "unreachable", message: error instanceof Error ? error.message : "unknown" },
      { status: 503 },
    );
  }
}

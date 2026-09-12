import { NextResponse } from "next/server";
import { bootPlatform } from "@/platform/boot";
import { getPlatformActor } from "@/platform/auth/session";
import { can } from "@/platform/permissions/evaluate";
import { listClasses, listEnrollments } from "@/platform/lms/classes";
import { attendanceRate, completionState, contentProgress } from "@/platform/lms/progress";

export async function GET() {
  await bootPlatform();
  const actor = await getPlatformActor();
  if (!actor || !can(actor, "lms.reports", "export")) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const lines = ["lop,hoc_vien,tien_do_noi_dung,chuyen_can,dat_khoa"];
  for (const cls of listClasses() as { id: string; name: string }[]) {
    for (const enrollment of listEnrollments(cls.id) as { id: string; full_name: string }[]) {
      const content = contentProgress(enrollment.id);
      const att = attendanceRate(enrollment.id);
      const done = completionState(enrollment.id);
      lines.push(
        [csv(cls.name), csv(enrollment.full_name), String(content.percent), att.percent ?? "", done.coursePassed ? "1" : "0"].join(","),
      );
    }
  }
  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="bao-cao-hoc-tap.csv"',
      "Cache-Control": "no-store",
    },
  });
}

function csv(value: string) {
  if (/[",\n]/.test(value)) return `"${value.replaceAll('"', '""')}"`;
  return value;
}

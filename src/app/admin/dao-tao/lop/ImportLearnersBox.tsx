"use client";

import { useMemo, useState } from "react";
import { importLearnersForm } from "@/platform/ui/actions";
import { parseCsv } from "@/platform/csv";

export function ImportLearnersBox({ classId }: { classId: string }) {
  const [csv, setCsv] = useState("hoten,email,phone,organization\n");
  const preview = useMemo(() => {
    return parseCsv(csv).map((row) => {
      const fullName = row.hoten || row["ho ten"] || row.name || row.fullname || "";
      const email = (row.email || "").toLowerCase();
      const errors: string[] = [];
      if (!fullName.trim()) errors.push("Thiếu họ tên");
      if (!email) errors.push("Thiếu email");
      else if (!email.includes("@")) errors.push("Email không hợp lệ");
      return { fullName, email, phone: row.phone || "", organization: row.organization || "", errors };
    });
  }, [csv]);
  const invalid = preview.some((row) => row.errors.length);

  return (
    <form action={importLearnersForm} className="mt-6 space-y-3 border-t border-[#163c3e]/10 pt-4">
      <input type="hidden" name="classId" value={classId} />
      <p className="text-sm font-semibold">Import hồ sơ học viên (không tạo tài khoản)</p>
      <p className="text-xs text-[#66746f]">Cột: hoten, email, phone, organization. Dòng trùng email sẽ dùng lại hồ sơ có sẵn.</p>
      <textarea className="input min-h-32 font-mono text-sm" name="csv" value={csv} onChange={(event) => setCsv(event.target.value)} />
      {preview.length ? (
        <div className="platform-table-wrap">
          <table className="platform-table">
            <thead><tr><th>Họ tên</th><th>Email</th><th>Kiểm tra</th></tr></thead>
            <tbody>
              {preview.map((row, index) => (
                <tr key={`${row.email}-${index}`}>
                  <td>{row.fullName || "—"}</td>
                  <td>{row.email || "—"}</td>
                  <td>{row.errors.length ? row.errors.join(", ") : "Hợp lệ"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="confirm" required disabled={invalid} />
        Xác nhận đã kiểm tra và ghi hồ sơ (không tạo tài khoản đăng nhập)
      </label>
      <button className="bg-[#163c3e] px-3 py-2 text-white" disabled={invalid || !preview.length}>Import</button>
    </form>
  );
}

export const DEFAULT_TZ = "Asia/Ho_Chi_Minh";

export function formatDateTime(iso: string | null | undefined, tz = DEFAULT_TZ) {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("vi-VN", {
    timeZone: tz,
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

export function formatDate(iso: string | null | undefined, tz = DEFAULT_TZ) {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("vi-VN", {
    timeZone: tz,
    dateStyle: "medium",
  }).format(date);
}

export function endsAfterStart(startIso: string, endIso: string) {
  return new Date(endIso).getTime() > new Date(startIso).getTime();
}

/** Convert `<input type="datetime-local">` values to UTC ISO, treating naive values as Asia/Ho_Chi_Minh. */
export function fromDatetimeLocal(value: string, offset = "+07:00") {
  const raw = value.trim();
  if (!raw) return "";
  if (/[zZ]|[+-]\d{2}:\d{2}$/.test(raw)) {
    const parsed = new Date(raw);
    if (Number.isNaN(parsed.getTime())) throw new Error("Thời gian không hợp lệ.");
    return parsed.toISOString();
  }
  const withSeconds = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(raw) ? `${raw}:00` : raw;
  const parsed = new Date(`${withSeconds}${offset}`);
  if (Number.isNaN(parsed.getTime())) throw new Error("Thời gian không hợp lệ.");
  return parsed.toISOString();
}

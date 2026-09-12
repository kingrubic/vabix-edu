export function safePlatformNext(next: string | null | undefined, fallback: string) {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.includes("\\")) return fallback;
  if (next.startsWith("/dang-nhap") || next.startsWith("/quen-mat-khau") || next.startsWith("/dat-lai-mat-khau")) {
    return fallback;
  }
  if (next.startsWith("/bizcar")) return fallback;
  return next;
}

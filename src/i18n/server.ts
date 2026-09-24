import { headers } from "next/headers";
import { LOCALE_HEADER, type Locale } from "./locale";

export async function getLocale(): Promise<Locale> {
  const headerList = await headers();
  return headerList.get(LOCALE_HEADER) === "en" ? "en" : "vi";
}

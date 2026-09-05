import { headers } from "next/headers";
import { CorporateHome } from "@/components/site/CorporateHome";
import { EngineLanding } from "@/components/bizcar/EngineLanding";
import { createMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/siteConfig";
import { isBizcarHost } from "@/security/routes";

export const metadata = createMetadata({
  title: "VABIX — Kết tri thức. Nối giá trị.",
  description: siteConfig.description,
  path: "/",
});

export default async function HomePage() {
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host");
  if (isBizcarHost(host)) {
    return <EngineLanding />;
  }
  return <CorporateHome />;
}

import { CorporateHome } from "@/components/site/CorporateHome";
import { createMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/siteConfig";

export async function generateMetadata() {
  const { getLocale } = await import("@/i18n/server");
  const locale = await getLocale();
  return createMetadata({
    title: locale === "en" ? "VABIX — Connect knowledge. Create value." : "VABIX — Kết tri thức. Nối giá trị.",
    description: locale === "en"
      ? "VABIX works with business owners and their teams to turn practical knowledge into action and build trusted business relationships."
      : siteConfig.description,
    path: locale === "en" ? "/en" : "/",
  });
}

export default function HomePage() {
  return <CorporateHome />;
}

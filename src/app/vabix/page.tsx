import { CorporateHome } from "@/components/site/CorporateHome";
import { createMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/siteConfig";

export const metadata = createMetadata({
  title: "VABIX — Kết tri thức. Nối giá trị.",
  description: siteConfig.description,
  path: "/vabix",
});

export default function VabixSitePage() {
  return <CorporateHome />;
}

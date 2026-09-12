import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/siteConfig";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin", "/admin/", "/hoc-tap", "/giang-day", "/lam-viec", "/tai-khoan", "/dang-nhap"],
    },
    sitemap: `${siteConfig.website}/sitemap.xml`,
  };
}

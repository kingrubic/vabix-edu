import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/siteConfig";
import { sitemapPaths } from "@/lib/sitemapPaths";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return sitemapPaths().map((path) => ({
    url: `${siteConfig.website}${path === "/" ? "" : path}`,
    lastModified: now,
  }));
}

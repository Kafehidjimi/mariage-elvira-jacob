import type { MetadataRoute } from "next";

import { wedding } from "@/data/wedding";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] },
    sitemap: `${wedding.seo.siteUrl}/sitemap.xml`,
  };
}

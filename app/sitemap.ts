import type { MetadataRoute } from "next";

import { wedding } from "@/data/wedding";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: wedding.seo.siteUrl, changeFrequency: "weekly", priority: 1 }];
}

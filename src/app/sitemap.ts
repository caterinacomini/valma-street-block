import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/site-url";

/**
 * One page, and deliberately so: everything else on this site is a section of
 * it reached by an anchor, and anchors are not separate URLs. The Studio is
 * left out on purpose — see robots.ts.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}

import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The Studio is publicly reachable and would otherwise be indexed: a
      // login screen on Google under the festival's name helps nobody.
      disallow: "/studio",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}

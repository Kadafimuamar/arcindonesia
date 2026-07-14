import type { MetadataRoute } from "next";
import { createAbsoluteUrl } from "@/lib/utils/runtime";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/admin"],
    },
    sitemap: createAbsoluteUrl("/sitemap.xml"),
  };
}

import type { MetadataRoute } from "next";
import { createAbsoluteUrl, isSupabaseConfigured } from "@/lib/utils/runtime";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createServices } from "@/services";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: createAbsoluteUrl("/") },
    { url: createAbsoluteUrl("/tulisan") },
    { url: createAbsoluteUrl("/cari") },
    { url: createAbsoluteUrl("/admin/login") },
  ];

  if (!isSupabaseConfigured()) {
    return staticRoutes;
  }

  const services = createServices(await createSupabaseServerClient());
  const posts = await services.posts.listPublic({ page: 1, pageSize: 100 });

  return [
    ...staticRoutes,
    ...posts.items.map((post) => ({
      url: createAbsoluteUrl(`/tulisan/${post.slug}`),
      lastModified: post.updatedAt,
    })),
  ];
}

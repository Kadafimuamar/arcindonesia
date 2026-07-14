import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import type { DashboardRepository } from "@/repositories/contracts";
import { mapCommentRecord, mapPostRecord } from "@/repositories/mappers";

export class SupabaseDashboardRepository implements DashboardRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async getStats() {
    const [{ count: totalPosts }, { count: publishedPosts }, { count: draftPosts }, { count: archivedPosts }, { count: totalComments }] =
      await Promise.all([
        this.supabase.from("posts").select("id", { count: "exact", head: true }).is("deleted_at", null),
        this.supabase
          .from("posts")
          .select("id", { count: "exact", head: true })
          .eq("status", "published")
          .is("deleted_at", null),
        this.supabase.from("posts").select("id", { count: "exact", head: true }).eq("status", "draft").is("deleted_at", null),
        this.supabase
          .from("posts")
          .select("id", { count: "exact", head: true })
          .eq("status", "archived")
          .is("deleted_at", null),
        this.supabase.from("comments").select("id", { count: "exact", head: true }).is("deleted_at", null),
      ]);

    const [{ data: recentPosts }, { data: recentComments }] = await Promise.all([
      this.supabase
        .from("posts")
        .select("*, profiles!inner(display_name)")
        .is("deleted_at", null)
        .order("created_at", { ascending: false })
        .limit(5),
      this.supabase
        .from("comments")
        .select("*, posts!inner(title)")
        .is("deleted_at", null)
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

    return {
      totalPosts: totalPosts ?? 0,
      publishedPosts: publishedPosts ?? 0,
      draftPosts: draftPosts ?? 0,
      archivedPosts: archivedPosts ?? 0,
      totalComments: totalComments ?? 0,
      recentPosts: (recentPosts ?? []).map((item) => mapPostRecord(item as never)),
      recentComments: (recentComments ?? []).map((item) => mapCommentRecord(item as never)),
    };
  }
}

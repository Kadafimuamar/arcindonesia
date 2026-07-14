import type { SupabaseClient } from "@supabase/supabase-js";
import type { CreatePostInput, ListPostsInput, PostsRepository, UpdatePostInput } from "@/repositories/contracts";
import { mapPostRecord } from "@/repositories/mappers";
import { toPaginated } from "@/repositories/pagination";

export class SupabasePostsRepository implements PostsRepository {
  constructor(private readonly supabase: SupabaseClient<any>) {}

  private applyPaging<T extends { range: (from: number, to: number) => T }>(query: T, input: ListPostsInput) {
    const from = (input.page - 1) * input.pageSize;
    const to = from + input.pageSize - 1;
    return query.range(from, to);
  }

  private applySort<T extends { order: (column: string, options?: { ascending?: boolean; nullsFirst?: boolean }) => T }>(
    query: T,
    sort: "latest" | "oldest" | undefined,
  ) {
    return query.order("published_at", { ascending: sort === "oldest", nullsFirst: false });
  }

  async listPublished(input: ListPostsInput) {
    let query = this.supabase
      .from("posts")
      .select("*, profiles!inner(display_name)", { count: "exact" })
      .eq("status", "published")
      .is("deleted_at", null);

    if (input.query) {
      query = query.or(`title.ilike.%${input.query}%,excerpt.ilike.%${input.query}%,content.ilike.%${input.query}%`);
    }

    query = this.applySort(query, input.sort);
    const { data, error, count } = await this.applyPaging(query, input);

    if (error) {
      throw new Error("Gagal mengambil daftar tulisan.");
    }

    return toPaginated((data ?? []).map((item: any) => mapPostRecord(item)), count ?? 0, input.page, input.pageSize);
  }

  async searchPublished(input: ListPostsInput) {
    if (!input.query) {
      return this.listPublished(input);
    }

    const { data, error } = await this.supabase.rpc("search_posts", {
      search_query: input.query,
      page_number: input.page,
      page_size: input.pageSize,
      sort_order: input.sort ?? "latest",
    });

    if (error) {
      throw new Error("Gagal melakukan pencarian tulisan.");
    }

    const rows = (data ?? []) as Array<Record<string, unknown> & { total_count?: number }>;
    return toPaginated(rows.map((item) => mapPostRecord(item as any)), rows[0]?.total_count ?? 0, input.page, input.pageSize);
  }

  async getPublishedBySlug(slug: string) {
    const { data, error } = await this.supabase
      .from("posts")
      .select("*, profiles!inner(display_name)")
      .eq("slug", slug)
      .eq("status", "published")
      .is("deleted_at", null)
      .maybeSingle();

    if (error) {
      throw new Error("Gagal mengambil detail tulisan.");
    }

    return data ? mapPostRecord(data as any) : null;
  }

  async getRelated(postId: string, limit: number) {
    const { data, error } = await this.supabase
      .from("posts")
      .select("*, profiles!inner(display_name)")
      .eq("status", "published")
      .is("deleted_at", null)
      .neq("id", postId)
      .order("published_at", { ascending: false, nullsFirst: false })
      .limit(limit);

    if (error) {
      throw new Error("Gagal mengambil tulisan terkait.");
    }

    return (data ?? []).map((item: any) => mapPostRecord(item));
  }

  async listAdmin(input: ListPostsInput) {
    let query = this.supabase.from("posts").select("*, profiles!inner(display_name)", { count: "exact" }).is("deleted_at", null);

    if (input.status) {
      query = query.eq("status", input.status);
    }

    if (input.query) {
      query = query.or(`title.ilike.%${input.query}%,slug.ilike.%${input.query}%`);
    }

    query = query.order("created_at", { ascending: input.sort === "oldest" });
    const { data, error, count } = await this.applyPaging(query, input);

    if (error) {
      throw new Error("Gagal mengambil daftar tulisan admin.");
    }

    return toPaginated((data ?? []).map((item: any) => mapPostRecord(item)), count ?? 0, input.page, input.pageSize);
  }

  async getById(id: string) {
    const { data, error } = await this.supabase
      .from("posts")
      .select("*, profiles!inner(display_name)")
      .eq("id", id)
      .is("deleted_at", null)
      .maybeSingle();

    if (error) {
      throw new Error("Gagal mengambil tulisan.");
    }

    return data ? mapPostRecord(data as any) : null;
  }

  async getBySlug(slug: string) {
    const { data, error } = await this.supabase
      .from("posts")
      .select("*, profiles!inner(display_name)")
      .eq("slug", slug)
      .is("deleted_at", null)
      .maybeSingle();

    if (error) {
      throw new Error("Gagal mengambil tulisan.");
    }

    return data ? mapPostRecord(data as any) : null;
  }

  async create(input: CreatePostInput) {
    const { data, error } = await this.supabase
      .from("posts")
      .insert({
        title: input.title,
        slug: input.slug,
        excerpt: input.excerpt,
        content: input.content,
        status: input.status,
        author_id: input.authorId,
        seo_title: input.seoTitle ?? null,
        seo_description: input.seoDescription ?? null,
        cover_image_url: input.coverImageUrl ?? null,
      })
      .select("*, profiles!inner(display_name)")
      .single();

    if (error) {
      throw new Error("Gagal membuat tulisan.");
    }

    return mapPostRecord(data as any);
  }

  async update(id: string, input: UpdatePostInput) {
    const { data, error } = await this.supabase
      .from("posts")
      .update({
        title: input.title,
        slug: input.slug,
        excerpt: input.excerpt,
        content: input.content,
        status: input.status,
        seo_title: input.seoTitle ?? null,
        seo_description: input.seoDescription ?? null,
        cover_image_url: input.coverImageUrl ?? null,
      })
      .eq("id", id)
      .select("*, profiles!inner(display_name)")
      .single();

    if (error) {
      throw new Error("Gagal memperbarui tulisan.");
    }

    return mapPostRecord(data as any);
  }

  async setStatus(id: string, status: "draft" | "published" | "archived", publishedAt: string | null) {
    const { data, error } = await this.supabase
      .from("posts")
      .update({ status, published_at: publishedAt })
      .eq("id", id)
      .select("*, profiles!inner(display_name)")
      .single();

    if (error) {
      throw new Error("Gagal memperbarui status tulisan.");
    }

    return mapPostRecord(data as any);
  }

  async remove(id: string) {
    const { error } = await this.supabase.from("posts").update({ deleted_at: new Date().toISOString() }).eq("id", id);

    if (error) {
      throw new Error("Gagal menghapus tulisan.");
    }
  }
}

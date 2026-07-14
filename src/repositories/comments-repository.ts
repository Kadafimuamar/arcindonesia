import type { SupabaseClient } from "@supabase/supabase-js";
import type { CommentsRepository, CreateCommentInput, ListCommentsInput } from "@/repositories/contracts";
import { mapCommentRecord } from "@/repositories/mappers";
import { toPaginated } from "@/repositories/pagination";

export class SupabaseCommentsRepository implements CommentsRepository {
  constructor(private readonly supabase: SupabaseClient<any>) {}

  async listVisibleForPost(postId: string, page: number, pageSize: number) {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await this.supabase
      .from("comments")
      .select("*, posts!inner(title)", { count: "exact" })
      .eq("post_id", postId)
      .eq("status", "visible")
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      throw new Error("Gagal mengambil komentar.");
    }

    return toPaginated((data ?? []).map((item: any) => mapCommentRecord(item)), count ?? 0, page, pageSize);
  }

  async listAdmin(input: ListCommentsInput) {
    const from = (input.page - 1) * input.pageSize;
    const to = from + input.pageSize - 1;

    let query = this.supabase
      .from("comments")
      .select("*, posts!inner(title)", { count: "exact" })
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    if (input.postId) {
      query = query.eq("post_id", input.postId);
    }

    if (input.status) {
      query = query.eq("status", input.status);
    }

    if (input.query) {
      query = query.or(`author_name.ilike.%${input.query}%,author_email.ilike.%${input.query}%,content.ilike.%${input.query}%`);
    }

    const { data, error, count } = await query.range(from, to);

    if (error) {
      throw new Error("Gagal mengambil daftar komentar.");
    }

    return toPaginated((data ?? []).map((item: any) => mapCommentRecord(item)), count ?? 0, input.page, input.pageSize);
  }

  async create(input: CreateCommentInput) {
    const { data, error } = await this.supabase
      .from("comments")
      .insert({
        post_id: input.postId,
        author_name: input.authorName,
        author_email: input.authorEmail,
        content: input.content,
        ip_hash: input.ipHash,
        status: "visible",
      })
      .select("*, posts!inner(title)")
      .single();

    if (error) {
      throw new Error("Gagal menyimpan komentar.");
    }

    return mapCommentRecord(data as any);
  }

  async countRecentByIpHash(ipHash: string, sinceIso: string) {
    const { count, error } = await this.supabase
      .from("comments")
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .gte("created_at", sinceIso)
      .is("deleted_at", null);

    if (error) {
      throw new Error("Gagal mengecek rate limit komentar.");
    }

    return count ?? 0;
  }

  async setStatus(id: string, status: "visible" | "hidden") {
    const { data, error } = await this.supabase
      .from("comments")
      .update({ status })
      .eq("id", id)
      .select("*, posts!inner(title)")
      .single();

    if (error) {
      throw new Error("Gagal memperbarui status komentar.");
    }

    return mapCommentRecord(data as any);
  }

  async remove(id: string) {
    const { error } = await this.supabase.from("comments").update({ deleted_at: new Date().toISOString() }).eq("id", id);

    if (error) {
      throw new Error("Gagal menghapus komentar.");
    }
  }
}

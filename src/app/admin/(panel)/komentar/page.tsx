import { CommentStatusActionButton } from "@/components/admin/comment-status-action-button";
import { ConfirmActionButton } from "@/components/admin/confirm-action-button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { formatDate } from "@/lib/utils/date";
import { getSearchParamsValue } from "@/lib/utils/request";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createServices } from "@/services";

export default async function AdminCommentsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) ?? {};
  const services = createServices(await createSupabaseServerClient());
  const q = getSearchParamsValue(params.q);
  const status = getSearchParamsValue(params.status) as "visible" | "hidden" | undefined;
  const comments = await services.comments.listAdmin({ q, status });

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">Admin</p>
        <h1 className="font-serif text-4xl font-semibold text-primary">Kelola komentar</h1>
      </div>
      <Card>
        <CardContent className="space-y-6">
          <form className="grid gap-3 md:grid-cols-[1fr_220px_auto]">
            <Input name="q" placeholder="Cari nama, email, atau isi komentar..." defaultValue={q} />
            <Select name="status" defaultValue={status ?? ""}>
              <option value="">Semua status</option>
              <option value="visible">Visible</option>
              <option value="hidden">Hidden</option>
            </Select>
            <button type="submit" className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">
              Filter
            </button>
          </form>
          <div className="space-y-4">
            {comments.items.map((comment) => (
              <div key={comment.id} className="rounded-[28px] border border-border p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      <span>{comment.status}</span>
                      <span>{formatDate(comment.createdAt)}</span>
                    </div>
                    <h2 className="font-semibold text-primary">{comment.authorName}</h2>
                    <p className="text-sm text-muted-foreground">{comment.authorEmail}</p>
                    <p className="text-sm text-muted-foreground">{comment.postTitle ?? "Tulisan"}</p>
                    <p className="text-sm leading-7 text-foreground">{comment.content}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <CommentStatusActionButton id={comment.id} status={comment.status} />
                    <ConfirmActionButton
                      action="Delete"
                      confirmTitle="Hapus komentar"
                      confirmDescription="Komentar akan ditandai sebagai terhapus."
                      endpoint={`/api/admin/comments/${comment.id}`}
                      method="DELETE"
                      variant="danger"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

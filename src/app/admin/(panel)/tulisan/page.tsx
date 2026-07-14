import Link from "next/link";
import { AdminPostActions } from "@/components/admin/admin-post-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { formatDate } from "@/lib/utils/date";
import { getSearchParamsValue } from "@/lib/utils/request";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createServices } from "@/services";

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) ?? {};
  const services = createServices(await createSupabaseServerClient());
  const q = getSearchParamsValue(params.q);
  const status = getSearchParamsValue(params.status) as "draft" | "published" | "archived" | undefined;
  const page = getSearchParamsValue(params.page);
  const posts = await services.posts.listAdmin({ q, status, page });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">Admin</p>
          <h1 className="font-serif text-4xl font-semibold text-primary">Daftar tulisan</h1>
        </div>
        <Button asChild variant="accent">
          <Link href="/admin/tulisan/baru">Tambah tulisan</Link>
        </Button>
      </div>
      <Card>
        <CardContent className="space-y-6">
          <form className="grid gap-3 md:grid-cols-[1fr_220px_auto]">
            <Input name="q" placeholder="Cari judul atau slug..." defaultValue={q} />
            <Select name="status" defaultValue={status ?? ""}>
              <option value="">Semua status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </Select>
            <Button type="submit" variant="outline">
              Filter
            </Button>
          </form>
          <div className="space-y-4">
            {posts.items.map((post) => (
              <div key={post.id} className="grid gap-4 rounded-[28px] border border-border p-5 lg:grid-cols-[1fr_auto]">
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    <span>{post.status}</span>
                    <span>{formatDate(post.createdAt)}</span>
                    <span>{post.publishedAt ? `Terbit ${formatDate(post.publishedAt)}` : "Belum terbit"}</span>
                  </div>
                  <h2 className="font-serif text-2xl font-semibold text-primary">{post.title}</h2>
                  <p className="text-sm text-muted-foreground">{post.authorName}</p>
                  <div className="flex flex-wrap gap-3 text-sm">
                    <Link href={`/admin/tulisan/${post.id}/edit`} className="text-primary underline-offset-4 hover:underline">
                      Edit
                    </Link>
                    <Link href={`/tulisan/${post.slug}`} className="text-primary underline-offset-4 hover:underline">
                      Preview
                    </Link>
                  </div>
                </div>
                <AdminPostActions id={post.id} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

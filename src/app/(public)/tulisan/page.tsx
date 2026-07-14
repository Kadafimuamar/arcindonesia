import Link from "next/link";
import { ArticleCard } from "@/components/blog/article-card";
import { EmptyState } from "@/components/blog/empty-state";
import { ErrorState } from "@/components/blog/error-state";
import { PaginationControls } from "@/components/blog/pagination-controls";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { createSeoMetadata } from "@/lib/utils/metadata";
import { getSearchParamsValue } from "@/lib/utils/request";
import { isSupabaseConfigured } from "@/lib/utils/runtime";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createServices } from "@/services";

export const metadata = createSeoMetadata({
  title: "Semua Tulisan",
  path: "/tulisan",
});

export default async function AllPostsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) ?? {};
  const page = getSearchParamsValue(params.page);
  const sort = getSearchParamsValue(params.sort) === "oldest" ? "oldest" : "latest";

  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <ErrorState title="Supabase belum dikonfigurasi" description="Isi environment Supabase agar daftar tulisan dapat dimuat." />
      </div>
    );
  }

  try {
    const services = createServices(await createSupabaseServerClient());
    const posts = await services.posts.listPublic({ page, sort });

    return (
      <div className="mx-auto max-w-7xl space-y-10 px-4 py-12 sm:px-6 lg:px-8">
        <section className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">Arsip editorial</p>
            <h1 className="font-serif text-5xl font-semibold text-primary">Semua tulisan</h1>
            <p className="max-w-2xl text-base leading-8 text-muted-foreground">
              Jelajahi seluruh tulisan yang sudah dipublikasikan. Gunakan pencarian untuk menemukan topik spesifik dengan cepat.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <form className="flex items-center gap-3" action="/tulisan">
              <Select name="sort" defaultValue={sort}>
                <option value="latest">Terbaru</option>
                <option value="oldest">Terlama</option>
              </Select>
              <Button type="submit" variant="outline">
                Terapkan
              </Button>
            </form>
            <Button asChild variant="accent">
              <Link href="/cari">Buka pencarian</Link>
            </Button>
          </div>
        </section>
        {posts.items.length > 0 ? (
          <>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {posts.items.map((post) => (
                <ArticleCard key={post.id} post={post} />
              ))}
            </div>
            <PaginationControls page={posts.page} totalPages={posts.totalPages} hrefBuilder={(nextPage) => `/tulisan?page=${nextPage}&sort=${sort}`} />
          </>
        ) : (
          <EmptyState title="Belum ada tulisan" description="Tulisan yang sudah dipublish akan tampil di halaman ini." />
        )}
      </div>
    );
  } catch (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <ErrorState title="Daftar tulisan gagal dimuat" description={error instanceof Error ? error.message : "Terjadi kesalahan saat mengambil tulisan."} />
      </div>
    );
  }
}

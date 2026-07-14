import { ArticleCard } from "@/components/blog/article-card";
import { EmptyState } from "@/components/blog/empty-state";
import { ErrorState } from "@/components/blog/error-state";
import { PaginationControls } from "@/components/blog/pagination-controls";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createSeoMetadata } from "@/lib/utils/metadata";
import { getSearchParamsValue } from "@/lib/utils/request";
import { isSupabaseConfigured } from "@/lib/utils/runtime";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createServices } from "@/services";

export const metadata = createSeoMetadata({
  title: "Cari Tulisan",
  path: "/cari",
});

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) ?? {};
  const page = getSearchParamsValue(params.page);
  const q = getSearchParamsValue(params.q)?.trim() ?? "";

  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <ErrorState title="Supabase belum dikonfigurasi" description="Isi environment Supabase agar pencarian dapat digunakan." />
      </div>
    );
  }

  try {
    const services = createServices(await createSupabaseServerClient());
    const results = q ? await services.posts.searchPublic({ q, page }) : await services.posts.listPublic({ page: 1 });

    return (
      <div className="mx-auto max-w-7xl space-y-10 px-4 py-12 sm:px-6 lg:px-8">
        <section className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">Pencarian</p>
          <h1 className="font-serif text-5xl font-semibold text-primary">Cari tulisan</h1>
          <form action="/cari" className="flex flex-col gap-3 sm:flex-row">
            <Input name="q" placeholder="Masukkan kata kunci..." defaultValue={q} />
            <Button type="submit" variant="accent">
              Cari
            </Button>
          </form>
          {q ? <p className="text-sm text-muted-foreground">Menampilkan hasil untuk: "{q}"</p> : null}
        </section>
        {results.items.length > 0 ? (
          <>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {results.items.map((post) => (
                <ArticleCard key={post.id} post={post} />
              ))}
            </div>
            <PaginationControls page={results.page} totalPages={results.totalPages} hrefBuilder={(nextPage) => `/cari?q=${encodeURIComponent(q)}&page=${nextPage}`} />
          </>
        ) : (
          <EmptyState
            title={q ? "Tidak ada hasil" : "Mulai pencarian"}
            description={q ? "Coba gunakan kata kunci lain atau buka halaman semua tulisan." : "Masukkan kata kunci untuk mencari berdasarkan judul, ringkasan, dan isi tulisan."}
          />
        )}
      </div>
    );
  } catch (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <ErrorState title="Pencarian gagal dimuat" description={error instanceof Error ? error.message : "Terjadi kesalahan saat melakukan pencarian."} />
      </div>
    );
  }
}

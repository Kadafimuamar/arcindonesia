import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ArticleCard } from "@/components/blog/article-card";
import { EmptyState } from "@/components/blog/empty-state";
import { ErrorState } from "@/components/blog/error-state";
import { FeaturedArticle } from "@/components/blog/featured-article";
import { PaginationControls } from "@/components/blog/pagination-controls";
import { Button } from "@/components/ui/button";
import { createSeoMetadata } from "@/lib/utils/metadata";
import { getSearchParamsValue } from "@/lib/utils/request";
import { isSupabaseConfigured } from "@/lib/utils/runtime";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createServices } from "@/services";

export const metadata = createSeoMetadata({
  title: "Beranda",
  path: "/",
});

export default async function HomePage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) ?? {};
  const page = getSearchParamsValue(params.page);

  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-7xl space-y-12 px-4 py-12 sm:px-6 lg:px-8">
        <ErrorState
          title="Supabase belum dikonfigurasi"
          description="Isi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY agar homepage bisa mengambil artikel dari database."
        />
      </div>
    );
  }

  try {
    const services = createServices(await createSupabaseServerClient());
    const posts = await services.posts.listPublic({ page });
    const featured = posts.items[0];
    const rest = posts.items.slice(1);

    return (
      <div className="mx-auto max-w-7xl space-y-12 px-4 py-12 sm:px-6 lg:px-8">
        <section className="space-y-5">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">Editorial pilihan</p>
          {featured ? (
            <FeaturedArticle post={featured} />
          ) : (
            <EmptyState
              title="Belum ada tulisan terbit"
              description="Publikasikan tulisan pertama dari dashboard admin untuk menampilkan konten di homepage."
            />
          )}
        </section>
        <section className="space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">Terbaru</p>
              <h2 className="mt-2 font-serif text-4xl font-semibold text-primary">Tulisan terbaru</h2>
            </div>
            <Button asChild variant="outline">
              <Link href="/tulisan">
                Lihat semua tulisan
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          {rest.length > 0 ? (
            <>
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {rest.map((post) => (
                  <ArticleCard key={post.id} post={post} />
                ))}
              </div>
              <PaginationControls page={posts.page} totalPages={posts.totalPages} hrefBuilder={(nextPage) => `/?page=${nextPage}`} />
            </>
          ) : featured ? null : (
            <EmptyState title="Belum ada tulisan" description="Setelah artikel dipublish, daftar tulisan terbaru akan muncul di sini." />
          )}
        </section>
      </div>
    );
  } catch (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <ErrorState title="Homepage gagal dimuat" description={error instanceof Error ? error.message : "Terjadi kesalahan saat mengambil data."} />
      </div>
    );
  }
}

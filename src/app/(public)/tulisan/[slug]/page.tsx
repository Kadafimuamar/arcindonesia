import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/simple-breadcrumb";
import { CommentForm } from "@/components/comments/comment-form";
import { CommentList } from "@/components/comments/comment-list";
import { ArticleCard } from "@/components/blog/article-card";
import { EmptyState } from "@/components/blog/empty-state";
import { JsonLd } from "@/components/blog/json-ld";
import { MarkdownContent } from "@/components/blog/markdown-content";
import { ShareActions } from "@/components/blog/share-actions";
import { Badge } from "@/components/ui/badge";
import { calculateReadingTime } from "@/lib/utils/reading-time";
import { formatDate } from "@/lib/utils/date";
import { createSeoMetadata } from "@/lib/utils/metadata";
import { createAbsoluteUrl, isSupabaseConfigured } from "@/lib/utils/runtime";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createServices } from "@/services";

async function getPostData(slug: string) {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const services = createServices(await createSupabaseServerClient());
  const post = await services.posts.getPublicDetail(slug);

  if (!post) {
    return null;
  }

  const [related, comments] = await Promise.all([services.posts.getRelated(post.id), services.comments.listVisible(post.id)]);

  return {
    post,
    related,
    comments: comments.items,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getPostData(slug);

  if (!data) {
    return createSeoMetadata({
      title: "Tulisan tidak ditemukan",
      path: `/tulisan/${slug}`,
    });
  }

  return createSeoMetadata({
    title: data.post.seoTitle ?? data.post.title,
    description: data.post.seoDescription ?? data.post.excerpt,
    path: `/tulisan/${data.post.slug}`,
  });
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getPostData(slug);

  if (!data) {
    notFound();
  }

  const { post, related, comments } = data;
  const url = createAbsoluteUrl(`/tulisan/${post.slug}`);

  return (
    <div className="mx-auto max-w-5xl space-y-12 px-4 py-12 sm:px-6 lg:px-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.excerpt,
          datePublished: post.publishedAt,
          dateModified: post.updatedAt,
          author: {
            "@type": "Person",
            name: post.authorName,
          },
          mainEntityOfPage: url,
          image: post.coverImageUrl ? [post.coverImageUrl] : undefined,
        }}
      />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Beranda</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/tulisan">Tulisan</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>{post.title}</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <article className="space-y-8">
        <div className="space-y-5">
          <Badge>{formatDate(post.publishedAt ?? post.createdAt)}</Badge>
          <h1 className="font-serif text-5xl font-semibold leading-tight text-primary md:text-6xl">{post.title}</h1>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span>{post.authorName}</span>
            <span>{calculateReadingTime(post.content)} menit baca</span>
          </div>
          <p className="max-w-3xl text-lg leading-8 text-muted-foreground">{post.excerpt}</p>
          <ShareActions title={post.title} url={url} />
        </div>
        <MarkdownContent content={post.content} />
      </article>
      <section className="space-y-6">
        <div>
          <h2 className="font-serif text-3xl font-semibold text-primary">Tulisan terkait</h2>
        </div>
        {related.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {related.map((item) => (
              <ArticleCard key={item.id} post={item} />
            ))}
          </div>
        ) : (
          <EmptyState title="Belum ada tulisan terkait" description="Tulisan terkait akan muncul otomatis saat artikel lain sudah dipublikasikan." />
        )}
      </section>
      <section className="space-y-6">
        <div>
          <h2 className="font-serif text-3xl font-semibold text-primary">Komentar</h2>
        </div>
        {comments.length > 0 ? <CommentList comments={comments} /> : <EmptyState title="Belum ada komentar" description="Jadilah pembaca pertama yang meninggalkan komentar." />}
        <CommentForm slug={post.slug} />
      </section>
      <div className="text-sm text-muted-foreground">
        <Link href="/tulisan" className="text-primary underline-offset-4 hover:underline">
          Kembali ke semua tulisan
        </Link>
      </div>
    </div>
  );
}

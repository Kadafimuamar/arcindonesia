import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { calculateReadingTime } from "@/lib/utils/reading-time";
import { formatDate } from "@/lib/utils/date";
import type { PostRecord } from "@/types/domain";

export function FeaturedArticle({ post }: { post: PostRecord }) {
  return (
    <section className="grid items-stretch gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-5 rounded-[32px] bg-primary p-8 text-primary-foreground shadow-soft md:p-10">
        <Badge className="w-fit bg-white/10 text-primary-foreground">{formatDate(post.publishedAt ?? post.createdAt)}</Badge>
        <div className="space-y-4">
          <h1 className="font-serif text-4xl font-semibold leading-tight md:text-6xl">{post.title}</h1>
          <p className="max-w-2xl text-base leading-8 text-primary-foreground/78 md:text-lg">{post.excerpt}</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm text-primary-foreground/72">
          <span>{post.authorName}</span>
          <span className="inline-flex items-center gap-2">
            <Clock3 className="h-4 w-4" />
            {calculateReadingTime(post.content)} menit baca
          </span>
        </div>
        <Button asChild variant="accent" size="lg">
          <Link href={`/tulisan/${post.slug}`}>
            Baca tulisan
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
      <div className="relative min-h-[320px] overflow-hidden rounded-[32px] border border-border bg-secondary shadow-soft">
        {post.coverImageUrl ? (
          <Image src={post.coverImageUrl} alt={post.title} fill className="object-cover" priority sizes="(max-width: 1024px) 100vw, 40vw" />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-orange-100 to-amber-50 p-8 text-center font-serif text-3xl font-semibold text-primary">
            {post.title}
          </div>
        )}
      </div>
    </section>
  );
}

import Image from "next/image";
import Link from "next/link";
import { Clock3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { calculateReadingTime } from "@/lib/utils/reading-time";
import { formatDate } from "@/lib/utils/date";
import type { PostRecord } from "@/types/domain";

export function ArticleCard({ post }: { post: PostRecord }) {
  return (
    <Card className="overflow-hidden">
      {post.coverImageUrl ? (
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image src={post.coverImageUrl} alt={post.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
        </div>
      ) : null}
      <CardContent className="space-y-4">
        <Badge>{formatDate(post.publishedAt ?? post.createdAt)}</Badge>
        <div className="space-y-3">
          <Link href={`/tulisan/${post.slug}`} className="block">
            <h3 className="font-serif text-2xl font-semibold leading-tight text-primary">{post.title}</h3>
          </Link>
          <p className="text-sm leading-7 text-muted-foreground">{post.excerpt}</p>
        </div>
        <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
          <span>{post.authorName}</span>
          <span className="inline-flex items-center gap-2">
            <Clock3 className="h-4 w-4" />
            {calculateReadingTime(post.content)} menit baca
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

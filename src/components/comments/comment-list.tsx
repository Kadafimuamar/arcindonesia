import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils/date";
import type { CommentRecord } from "@/types/domain";

export function CommentList({ comments }: { comments: CommentRecord[] }) {
  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <Card key={comment.id}>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold text-primary">{comment.authorName}</p>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{formatDate(comment.createdAt)}</p>
            </div>
            <p className="whitespace-pre-wrap text-sm leading-7 text-foreground">{comment.content}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

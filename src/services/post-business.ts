import type { PostRecord, PostStatus } from "@/types/domain";

export function resolvePublishedAtForMutation(existing: PostRecord | null, nextStatus: PostStatus): string | null {
  if (nextStatus !== "published") {
    return existing?.publishedAt ?? null;
  }

  if (existing?.publishedAt) {
    return existing.publishedAt;
  }

  return new Date().toISOString();
}

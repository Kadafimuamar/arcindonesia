import type { CommentRecord, PostRecord } from "@/types/domain";
import type { Database } from "@/types/database";

type PostRow = Database["public"]["Tables"]["posts"]["Row"] & {
  profiles?: { display_name: string } | { display_name: string }[] | null;
  author_name?: string;
};

type CommentRow = Database["public"]["Tables"]["comments"]["Row"] & {
  posts?: { title: string } | { title: string }[] | null;
};

function extractDisplayName(row: PostRow): string {
  if (typeof row.author_name === "string") {
    return row.author_name;
  }

  if (Array.isArray(row.profiles)) {
    return row.profiles[0]?.display_name ?? "Admin";
  }

  return row.profiles?.display_name ?? "Admin";
}

function extractPostTitle(row: CommentRow): string | undefined {
  if (Array.isArray(row.posts)) {
    return row.posts[0]?.title;
  }

  return row.posts?.title;
}

export function mapPostRecord(row: PostRow): PostRecord {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content,
    coverImageUrl: row.cover_image_url,
    status: row.status,
    authorId: row.author_id,
    authorName: extractDisplayName(row),
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deletedAt: row.deleted_at,
  };
}

export function mapCommentRecord(row: CommentRow): CommentRecord {
  return {
    id: row.id,
    postId: row.post_id,
    postTitle: extractPostTitle(row),
    authorName: row.author_name,
    authorEmail: row.author_email,
    content: row.content,
    status: row.status,
    ipHash: row.ip_hash,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deletedAt: row.deleted_at,
  };
}

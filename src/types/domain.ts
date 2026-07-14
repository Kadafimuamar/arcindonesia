export type PostStatus = "draft" | "published" | "archived";
export type CommentStatus = "visible" | "hidden";
export type ProfileRole = "admin" | "reader";

export type PostRecord = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl: string | null;
  status: PostStatus;
  authorId: string;
  authorName: string;
  seoTitle: string | null;
  seoDescription: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type CommentRecord = {
  id: string;
  postId: string;
  postTitle?: string;
  authorName: string;
  authorEmail: string;
  content: string;
  status: CommentStatus;
  ipHash: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type DashboardStats = {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  archivedPosts: number;
  totalComments: number;
  recentPosts: PostRecord[];
  recentComments: CommentRecord[];
};

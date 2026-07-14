import type { CommentRecord, DashboardStats, PostRecord, PostStatus } from "@/types/domain";

export type ListPostsInput = {
  page: number;
  pageSize: number;
  query?: string;
  sort?: "latest" | "oldest";
  status?: PostStatus;
};

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type CreatePostInput = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: PostStatus;
  seoTitle?: string | null;
  seoDescription?: string | null;
  coverImageUrl?: string | null;
  authorId: string;
};

export type UpdatePostInput = Omit<CreatePostInput, "authorId">;

export interface PostsRepository {
  listPublished(input: ListPostsInput): Promise<Paginated<PostRecord>>;
  searchPublished(input: ListPostsInput): Promise<Paginated<PostRecord>>;
  getPublishedBySlug(slug: string): Promise<PostRecord | null>;
  getRelated(postId: string, limit: number): Promise<PostRecord[]>;
  listAdmin(input: ListPostsInput): Promise<Paginated<PostRecord>>;
  getById(id: string): Promise<PostRecord | null>;
  getBySlug(slug: string): Promise<PostRecord | null>;
  create(input: CreatePostInput): Promise<PostRecord>;
  update(id: string, input: UpdatePostInput): Promise<PostRecord>;
  setStatus(id: string, status: PostStatus, publishedAt: string | null): Promise<PostRecord>;
  remove(id: string): Promise<void>;
}

export type ListCommentsInput = {
  postId?: string;
  status?: "visible" | "hidden";
  page: number;
  pageSize: number;
  query?: string;
};

export type CreateCommentInput = {
  postId: string;
  authorName: string;
  authorEmail: string;
  content: string;
  ipHash: string;
};

export interface CommentsRepository {
  listVisibleForPost(postId: string, page: number, pageSize: number): Promise<Paginated<CommentRecord>>;
  listAdmin(input: ListCommentsInput): Promise<Paginated<CommentRecord>>;
  create(input: CreateCommentInput): Promise<CommentRecord>;
  countRecentByIpHash(ipHash: string, sinceIso: string): Promise<number>;
  setStatus(id: string, status: "visible" | "hidden"): Promise<CommentRecord>;
  remove(id: string): Promise<void>;
}

export interface DashboardRepository {
  getStats(): Promise<DashboardStats>;
}

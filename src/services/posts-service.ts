import { normalizePagination } from "@/lib/utils/pagination";
import { createSlug } from "@/lib/utils/slug";
import { postInputSchema } from "@/lib/validation/post";
import type { PostsRepository } from "@/repositories/contracts";
import type { PostStatus } from "@/types/domain";
import { resolvePublishedAtForMutation } from "@/services/post-business";

type PostInputCandidate = {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  status?: PostStatus;
  seoTitle?: string | null;
  seoDescription?: string | null;
  coverImageUrl?: string | null;
};

export class PostsService {
  constructor(private readonly repository: PostsRepository) {}

  async listPublic(input: { page?: number | string; pageSize?: number | string; q?: string; sort?: "latest" | "oldest" }) {
    const pagination = normalizePagination(input.page, input.pageSize);
    return this.repository.listPublished({
      ...pagination,
      query: input.q?.trim() || undefined,
      sort: input.sort ?? "latest",
    });
  }

  async searchPublic(input: { page?: number | string; pageSize?: number | string; q?: string; sort?: "latest" | "oldest" }) {
    const pagination = normalizePagination(input.page, input.pageSize);
    return this.repository.searchPublished({
      ...pagination,
      query: input.q?.trim() || undefined,
      sort: input.sort ?? "latest",
    });
  }

  async getPublicDetail(slug: string) {
    return this.repository.getPublishedBySlug(slug);
  }

  async getRelated(postId: string, limit = 3) {
    return this.repository.getRelated(postId, limit);
  }

  async listAdmin(input: {
    page?: number | string;
    pageSize?: number | string;
    q?: string;
    sort?: "latest" | "oldest";
    status?: PostStatus;
  }) {
    const pagination = normalizePagination(input.page, input.pageSize);
    return this.repository.listAdmin({
      ...pagination,
      query: input.q?.trim() || undefined,
      sort: input.sort ?? "latest",
      status: input.status,
    });
  }

  async getAdminDetail(id: string) {
    return this.repository.getById(id);
  }

  async create(input: unknown, authorId: string) {
    const raw = (input ?? {}) as PostInputCandidate;
    const payload = postInputSchema.parse({
      title: raw.title ?? "",
      slug: createSlug(raw.slug || raw.title || ""),
      excerpt: raw.excerpt ?? "",
      content: raw.content ?? "",
      status: raw.status ?? "draft",
      seoTitle: raw.seoTitle ?? null,
      seoDescription: raw.seoDescription ?? null,
      coverImageUrl: raw.coverImageUrl ?? null,
    });
    const existing = await this.repository.getBySlug(payload.slug);

    if (existing) {
      throw new Error("Slug sudah digunakan.");
    }

    const created = await this.repository.create({
      ...payload,
      authorId,
    });

    if (payload.status === "published") {
      return this.repository.setStatus(created.id, "published", new Date().toISOString());
    }

    return created;
  }

  async update(id: string, input: unknown) {
    const raw = (input ?? {}) as PostInputCandidate;
    const payload = postInputSchema.parse({
      title: raw.title ?? "",
      slug: createSlug(raw.slug || raw.title || ""),
      excerpt: raw.excerpt ?? "",
      content: raw.content ?? "",
      status: raw.status ?? "draft",
      seoTitle: raw.seoTitle ?? null,
      seoDescription: raw.seoDescription ?? null,
      coverImageUrl: raw.coverImageUrl ?? null,
    });
    const existing = await this.repository.getById(id);

    if (!existing) {
      throw new Error("Tulisan tidak ditemukan.");
    }

    const slugOwner = await this.repository.getBySlug(payload.slug);
    if (slugOwner && slugOwner.id !== id) {
      throw new Error("Slug sudah digunakan.");
    }

    const updated = await this.repository.update(id, payload);
    const publishedAt = resolvePublishedAtForMutation(existing, payload.status);
    return this.repository.setStatus(updated.id, payload.status, publishedAt);
  }

  async setStatus(id: string, status: PostStatus) {
    const existing = await this.repository.getById(id);

    if (!existing) {
      throw new Error("Tulisan tidak ditemukan.");
    }

    return this.repository.setStatus(id, status, resolvePublishedAtForMutation(existing, status));
  }

  async remove(id: string) {
    const existing = await this.repository.getById(id);

    if (!existing) {
      throw new Error("Tulisan tidak ditemukan.");
    }

    await this.repository.remove(id);
  }
}

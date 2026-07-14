import { describe, expect, it } from "vitest";
import { PostsService } from "@/services/posts-service";
import type { PostsRepository } from "@/repositories/contracts";
import type { PostRecord } from "@/types/domain";

const publishedPost: PostRecord = {
  id: "1",
  title: "Published",
  slug: "published",
  excerpt: "Ringkasan post published yang valid.",
  content: "Konten panjang untuk post published yang valid di layer integration test.",
  coverImageUrl: null,
  status: "published",
  authorId: "admin",
  authorName: "Admin",
  seoTitle: null,
  seoDescription: null,
  publishedAt: "2025-01-01T00:00:00.000Z",
  createdAt: "2025-01-01T00:00:00.000Z",
  updatedAt: "2025-01-01T00:00:00.000Z",
  deletedAt: null,
};

function createRepository(overrides?: Partial<PostsRepository>): PostsRepository {
  return {
    listPublished: async () => ({ items: [publishedPost], total: 1, page: 1, pageSize: 6, totalPages: 1 }),
    searchPublished: async () => ({ items: [publishedPost], total: 1, page: 1, pageSize: 6, totalPages: 1 }),
    getPublishedBySlug: async (slug) => (slug === "published" ? publishedPost : null),
    getRelated: async () => [],
    listAdmin: async () => ({ items: [publishedPost], total: 1, page: 1, pageSize: 6, totalPages: 1 }),
    getById: async () => publishedPost,
    getBySlug: async () => null,
    create: async (input) => ({ ...publishedPost, ...input, id: "2", authorName: "Admin", publishedAt: null }),
    update: async (id, input) => ({ ...publishedPost, ...input, id }),
    setStatus: async (id, status, publishedAt) => ({ ...publishedPost, id, status, publishedAt }),
    remove: async () => undefined,
    ...overrides,
  };
}

describe("PostsService integration", () => {
  it("public hanya mendapat post published", async () => {
    const service = new PostsService(createRepository());
    const result = await service.listPublic({});
    expect(result.items.every((item) => item.status === "published")).toBe(true);
  });

  it("draft tidak muncul pada detail public", async () => {
    const service = new PostsService(createRepository({ getPublishedBySlug: async () => null }));
    await expect(service.getPublicDetail("draft")).resolves.toBeNull();
  });

  it("admin tetap dapat melihat draft", async () => {
    const service = new PostsService(
      createRepository({
        listAdmin: async () => ({
          items: [{ ...publishedPost, status: "draft" }],
          total: 1,
          page: 1,
          pageSize: 6,
          totalPages: 1,
        }),
      }),
    );
    const result = await service.listAdmin({ status: "draft" });
    expect(result.items[0]?.status).toBe("draft");
  });

  it("publish mengisi published_at", async () => {
    const service = new PostsService(createRepository({ getById: async () => ({ ...publishedPost, publishedAt: null, status: "draft" }) }));
    const result = await service.setStatus("1", "published");
    expect(result.publishedAt).toBeTruthy();
  });
});

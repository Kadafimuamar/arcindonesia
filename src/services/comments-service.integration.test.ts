import { beforeEach, describe, expect, it } from "vitest";
import { CommentsService } from "@/services/comments-service";
import type { CommentsRepository } from "@/repositories/contracts";

beforeEach(() => {
  process.env.COMMENT_RATE_LIMIT_PER_HOUR = "5";
});

function createRepository(overrides?: Partial<CommentsRepository>): CommentsRepository {
  return {
    listVisibleForPost: async () => ({ items: [], total: 0, page: 1, pageSize: 6, totalPages: 1 }),
    listAdmin: async () => ({ items: [], total: 0, page: 1, pageSize: 6, totalPages: 1 }),
    create: async (input) => ({
      id: "1",
      postId: input.postId,
      authorName: input.authorName,
      authorEmail: input.authorEmail,
      content: input.content,
      status: "visible",
      ipHash: input.ipHash,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
    }),
    countRecentByIpHash: async () => 0,
    setStatus: async (id, status) => ({
      id,
      postId: "p1",
      authorName: "Nama",
      authorEmail: "mail@example.com",
      content: "Komentar",
      status,
      ipHash: "hash",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
    }),
    remove: async () => undefined,
    ...overrides,
  };
}

describe("CommentsService integration", () => {
  it("komentar tersimpan ke post yang benar", async () => {
    const service = new CommentsService(createRepository());
    const comment = await service.create(
      "post-1",
      {
        authorName: "Nama Pembaca",
        authorEmail: "pembaca@example.com",
        content: "Komentar yang cukup panjang.",
        website: "",
      },
      "hash",
    );
    expect(comment.postId).toBe("post-1");
  });

  it("hidden comment tidak tampil untuk publik", async () => {
    const service = new CommentsService(
      createRepository({
        listVisibleForPost: async () => ({ items: [], total: 0, page: 1, pageSize: 6, totalPages: 1 }),
      }),
    );
    const result = await service.listVisible("post-1");
    expect(result.items).toHaveLength(0);
  });

  it("rate limit komentar ditolak saat limit tercapai", async () => {
    const service = new CommentsService(createRepository({ countRecentByIpHash: async () => 5 }));
    await expect(
      service.create(
        "post-1",
        {
          authorName: "Nama Pembaca",
          authorEmail: "pembaca@example.com",
          content: "Komentar yang cukup panjang.",
          website: "",
        },
        "hash",
      ),
    ).rejects.toThrow(/Batas komentar/);
  });
});

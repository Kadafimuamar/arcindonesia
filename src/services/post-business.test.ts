import { describe, expect, it } from "vitest";
import { resolvePublishedAtForMutation } from "@/services/post-business";

describe("resolvePublishedAtForMutation", () => {
  it("mengisi published_at saat pertama kali publish", () => {
    const result = resolvePublishedAtForMutation(null, "published");
    expect(result).toBeTruthy();
  });

  it("mempertahankan published_at lama saat update published", () => {
    const existing = {
      id: "1",
      title: "T",
      slug: "t",
      excerpt: "Ringkasan contoh yang cukup panjang",
      content: "Konten contoh yang cukup panjang untuk pengujian business rule.",
      coverImageUrl: null,
      status: "published" as const,
      authorId: "a",
      authorName: "Admin",
      seoTitle: null,
      seoDescription: null,
      publishedAt: "2025-01-01T00:00:00.000Z",
      createdAt: "2025-01-01T00:00:00.000Z",
      updatedAt: "2025-01-01T00:00:00.000Z",
      deletedAt: null,
    };

    expect(resolvePublishedAtForMutation(existing, "published")).toBe(existing.publishedAt);
  });
});

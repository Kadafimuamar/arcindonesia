import { describe, expect, it } from "vitest";
import { postInputSchema } from "@/lib/validation/post";

describe("postInputSchema", () => {
  it("menerima payload post yang valid", () => {
    expect(
      postInputSchema.parse({
        title: "Judul Tulisan",
        slug: "judul-tulisan",
        excerpt: "Ringkasan tulisan yang cukup panjang.",
        content: "Konten tulisan yang cukup panjang untuk lolos validasi post input schema.",
        status: "draft",
        coverImageUrl: null,
        seoTitle: null,
        seoDescription: null,
      }).slug,
    ).toBe("judul-tulisan");
  });
});

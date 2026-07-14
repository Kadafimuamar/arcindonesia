import { describe, expect, it } from "vitest";
import { commentInputSchema } from "@/lib/validation/comment";

describe("commentInputSchema", () => {
  it("menolak komentar terlalu pendek", () => {
    expect(() =>
      commentInputSchema.parse({
        authorName: "Ab",
        authorEmail: "ab@example.com",
        content: "a",
        website: "",
      }),
    ).toThrow();
  });
});

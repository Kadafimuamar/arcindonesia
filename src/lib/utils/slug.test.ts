import { describe, expect, it } from "vitest";
import { createSlug } from "@/lib/utils/slug";

describe("createSlug", () => {
  it("membuat slug lowercase aman", () => {
    expect(createSlug("Halo Dunia Baru!")).toBe("halo-dunia-baru");
  });
});

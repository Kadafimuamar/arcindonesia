import { describe, expect, it } from "vitest";
import { normalizePagination } from "@/lib/utils/pagination";

describe("normalizePagination", () => {
  it("menormalkan page dan pageSize", () => {
    expect(normalizePagination("-1", "999")).toEqual({
      page: 1,
      pageSize: 24,
    });
  });
});

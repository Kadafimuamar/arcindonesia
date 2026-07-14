import { describe, expect, it } from "vitest";
import { errorResponse, successResponse } from "@/lib/utils/response";

describe("response formatter", () => {
  it("membuat response sukses konsisten", () => {
    expect(successResponse({ ok: true }, { page: 1 })).toEqual({
      data: { ok: true },
      error: null,
      meta: { page: 1 },
    });
  });

  it("membuat response error konsisten", () => {
    expect(errorResponse("ERR", "Pesan aman")).toEqual({
      data: null,
      error: {
        code: "ERR",
        message: "Pesan aman",
      },
      meta: undefined,
    });
  });
});

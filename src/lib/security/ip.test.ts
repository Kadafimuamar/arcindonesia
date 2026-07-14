import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({
  headers: vi.fn(async () => ({
    get(name: string) {
      if (name === "x-forwarded-for") {
        return "127.0.0.1";
      }

      return null;
    },
  })),
}));

describe("hashRequestIp", () => {
  beforeEach(() => {
    process.env.IP_HASH_SECRET = "test-secret";
  });

  it("menghasilkan hash stabil untuk IP yang sama", async () => {
    const { hashRequestIp } = await import("@/lib/security/ip");
    await expect(hashRequestIp()).resolves.toHaveLength(64);
  });
});

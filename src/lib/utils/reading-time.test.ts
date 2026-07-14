import { describe, expect, it } from "vitest";
import { calculateReadingTime } from "@/lib/utils/reading-time";

describe("calculateReadingTime", () => {
  it("mengembalikan minimal satu menit", () => {
    expect(calculateReadingTime("singkat")).toBe(1);
  });
});

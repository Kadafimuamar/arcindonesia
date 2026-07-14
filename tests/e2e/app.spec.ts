import { test } from "@playwright/test";

test.describe("alur utama", () => {
  test.skip(true, "Butuh environment Supabase dan akun admin khusus e2e.");

  test("public dan admin flow", async () => {
    // Dijalankan saat environment e2e lengkap tersedia.
  });
});

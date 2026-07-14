import { headers } from "next/headers";
import { getPublicEnv } from "@/lib/utils/env";

export async function assertSameOrigin() {
  const headerStore = await headers();
  const origin = headerStore.get("origin");

  if (!origin) {
    return;
  }

  const allowedOrigin = new URL(getPublicEnv().appUrl).origin;

  if (origin !== allowedOrigin) {
    throw new Error("Permintaan lintas origin tidak diizinkan.");
  }
}

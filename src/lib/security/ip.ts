import { createHmac } from "node:crypto";
import { headers } from "next/headers";
import { assertServerEnv, getServerEnv } from "@/lib/utils/env";

export async function hashRequestIp(): Promise<string> {
  assertServerEnv(["ipHashSecret"]);

  const headerStore = await headers();
  const forwardedFor = headerStore.get("x-forwarded-for") ?? headerStore.get("x-real-ip") ?? "unknown";
  const candidate = forwardedFor.split(",")[0]?.trim() || "unknown";

  return createHmac("sha256", getServerEnv().ipHashSecret!).update(candidate).digest("hex");
}

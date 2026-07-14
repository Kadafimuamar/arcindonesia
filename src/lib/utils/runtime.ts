import { getPublicEnv } from "@/lib/utils/env";

export function isSupabaseConfigured() {
  const env = getPublicEnv();
  return Boolean(env.supabaseUrl && env.supabaseAnonKey);
}

export function createAbsoluteUrl(pathname = "/") {
  return new URL(pathname, getPublicEnv().appUrl).toString();
}

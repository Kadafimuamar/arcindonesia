import { COMMENT_MAX_PER_HOUR_DEFAULT } from "@/lib/utils/constants";

type PublicEnv = {
  appUrl: string;
  supabaseUrl: string | null;
  supabaseAnonKey: string | null;
};

type ServerEnv = PublicEnv & {
  serviceRoleKey: string | null;
  ipHashSecret: string | null;
  commentRateLimitPerHour: number;
};

function normalizeUrl(value: string | undefined, fallback: string): string {
  if (!value) {
    return fallback;
  }

  return value.replace(/\/$/, "");
}

export function getPublicEnv(): PublicEnv {
  return {
    appUrl: normalizeUrl(process.env.NEXT_PUBLIC_APP_URL, "http://localhost:3000"),
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? null,
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? null,
  };
}

export function getServerEnv(): ServerEnv {
  return {
    ...getPublicEnv(),
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? null,
    ipHashSecret: process.env.IP_HASH_SECRET ?? null,
    commentRateLimitPerHour: Number(process.env.COMMENT_RATE_LIMIT_PER_HOUR ?? COMMENT_MAX_PER_HOUR_DEFAULT),
  };
}

export function assertServerEnv(keys: Array<keyof Omit<ServerEnv, "appUrl" | "commentRateLimitPerHour">>): void {
  const env = getServerEnv();
  const missing = keys.filter((key) => !env[key]);

  if (missing.length > 0) {
    throw new Error(`Environment variable belum diisi: ${missing.join(", ")}`);
  }
}

import { createClient } from "@supabase/supabase-js";
import { assertServerEnv, getServerEnv } from "@/lib/utils/env";
import type { Database } from "@/types/database";

export function createSupabaseAdminClient() {
  assertServerEnv(["supabaseUrl", "serviceRoleKey"]);
  const env = getServerEnv();

  return createClient<Database>(env.supabaseUrl!, env.serviceRoleKey!, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AuthenticatedAdmin = {
  userId: string;
  email: string | null;
  displayName: string;
};

export async function getSessionUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { supabase, user };
}

export async function requireAdminPage(): Promise<AuthenticatedAdmin> {
  const { supabase, user } = await getSessionUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data } = await supabase.from("profiles").select("display_name, role").eq("id", user.id).maybeSingle();
  const profile = data as { display_name: string; role: "admin" | "reader" } | null;

  if (!profile || profile.role !== "admin") {
    redirect("/");
  }

  return {
    userId: user.id,
    email: user.email ?? null,
    displayName: profile.display_name,
  };
}

export async function requireAdminApi() {
  const { supabase, user } = await getSessionUser();

  if (!user) {
    return { kind: "unauthorized" as const };
  }

  const { data } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  const profile = data as { role: "admin" | "reader" } | null;

  if (!profile || profile.role !== "admin") {
    return { kind: "forbidden" as const };
  }

  return { kind: "ok" as const, userId: user.id, supabase };
}

import { fail, ok } from "@/lib/api/http";
import { requireAdminApi } from "@/lib/security/auth";
import { createServices } from "@/services";

export async function GET() {
  const admin = await requireAdminApi();

  if (admin.kind === "unauthorized") {
    return fail("UNAUTHORIZED", "Silakan login terlebih dahulu.", 401);
  }

  if (admin.kind === "forbidden") {
    return fail("FORBIDDEN", "Anda tidak memiliki akses admin.", 403);
  }

  const services = createServices(admin.supabase);
  const stats = await services.dashboard.getStats();
  return ok(stats, {});
}

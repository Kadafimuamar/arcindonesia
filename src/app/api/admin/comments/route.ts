import { commentAdminQuerySchema } from "@/lib/validation/comment";
import { fail, ok } from "@/lib/api/http";
import { handleApiError } from "@/lib/api/guards";
import { requireAdminApi } from "@/lib/security/auth";
import { createServices } from "@/services";

export async function GET(request: Request) {
  const admin = await requireAdminApi();

  if (admin.kind === "unauthorized") {
    return fail("UNAUTHORIZED", "Silakan login terlebih dahulu.", 401);
  }

  if (admin.kind === "forbidden") {
    return fail("FORBIDDEN", "Anda tidak memiliki akses admin.", 403);
  }

  try {
    const { searchParams } = new URL(request.url);
    const query = commentAdminQuerySchema.parse({
      q: searchParams.get("q") ?? undefined,
      page: searchParams.get("page") ?? undefined,
      pageSize: searchParams.get("pageSize") ?? undefined,
      status: searchParams.get("status") ?? undefined,
    });
    const services = createServices(admin.supabase);
    const comments = await services.comments.listAdmin(query);

    return ok(comments.items, {
      page: comments.page,
      pageSize: comments.pageSize,
      total: comments.total,
      totalPages: comments.totalPages,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

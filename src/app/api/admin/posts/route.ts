import { revalidatePath } from "next/cache";
import { fail, ok } from "@/lib/api/http";
import { handleApiError } from "@/lib/api/guards";
import { requireAdminApi } from "@/lib/security/auth";
import { assertSameOrigin } from "@/lib/security/origin";
import { postQuerySchema } from "@/lib/validation/post";
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
    const query = postQuerySchema.parse({
      q: searchParams.get("q") ?? undefined,
      page: searchParams.get("page") ?? undefined,
      pageSize: searchParams.get("pageSize") ?? undefined,
      status: searchParams.get("status") ?? undefined,
      sort: searchParams.get("sort") ?? undefined,
    });
    const services = createServices(admin.supabase);
    const posts = await services.posts.listAdmin(query);

    return ok(posts.items, {
      page: posts.page,
      pageSize: posts.pageSize,
      total: posts.total,
      totalPages: posts.totalPages,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  const admin = await requireAdminApi();

  if (admin.kind === "unauthorized") {
    return fail("UNAUTHORIZED", "Silakan login terlebih dahulu.", 401);
  }

  if (admin.kind === "forbidden") {
    return fail("FORBIDDEN", "Anda tidak memiliki akses admin.", 403);
  }

  try {
    await assertSameOrigin();
    const body = (await request.json()) as unknown;
    const services = createServices(admin.supabase);
    const post = await services.posts.create(body, admin.userId);

    revalidatePath("/");
    revalidatePath("/tulisan");
    revalidatePath("/admin");
    revalidatePath("/admin/tulisan");
    revalidatePath(`/tulisan/${post.slug}`);

    return ok(post, {}, 201);
  } catch (error) {
    return handleApiError(error);
  }
}

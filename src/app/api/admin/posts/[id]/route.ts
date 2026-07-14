import { revalidatePath } from "next/cache";
import { fail, ok } from "@/lib/api/http";
import { handleApiError } from "@/lib/api/guards";
import { requireAdminApi } from "@/lib/security/auth";
import { assertSameOrigin } from "@/lib/security/origin";
import { idParamSchema } from "@/lib/validation/common";
import { createServices } from "@/services";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdminApi();

  if (admin.kind === "unauthorized") {
    return fail("UNAUTHORIZED", "Silakan login terlebih dahulu.", 401);
  }

  if (admin.kind === "forbidden") {
    return fail("FORBIDDEN", "Anda tidak memiliki akses admin.", 403);
  }

  try {
    const { id } = idParamSchema.parse(await params);
    const services = createServices(admin.supabase);
    const post = await services.posts.getAdminDetail(id);

    if (!post) {
      return fail("NOT_FOUND", "Tulisan tidak ditemukan.", 404);
    }

    return ok(post, {});
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdminApi();

  if (admin.kind === "unauthorized") {
    return fail("UNAUTHORIZED", "Silakan login terlebih dahulu.", 401);
  }

  if (admin.kind === "forbidden") {
    return fail("FORBIDDEN", "Anda tidak memiliki akses admin.", 403);
  }

  try {
    await assertSameOrigin();
    const { id } = idParamSchema.parse(await params);
    const body = (await request.json()) as unknown;
    const services = createServices(admin.supabase);
    const post = await services.posts.update(id, body);

    revalidatePath("/");
    revalidatePath("/tulisan");
    revalidatePath("/admin");
    revalidatePath("/admin/tulisan");
    revalidatePath(`/tulisan/${post.slug}`);

    return ok(post, {});
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdminApi();

  if (admin.kind === "unauthorized") {
    return fail("UNAUTHORIZED", "Silakan login terlebih dahulu.", 401);
  }

  if (admin.kind === "forbidden") {
    return fail("FORBIDDEN", "Anda tidak memiliki akses admin.", 403);
  }

  try {
    const { id } = idParamSchema.parse(await params);
    const services = createServices(admin.supabase);
    const post = await services.posts.getAdminDetail(id);

    if (!post) {
      return fail("NOT_FOUND", "Tulisan tidak ditemukan.", 404);
    }

    await services.posts.remove(id);
    revalidatePath("/");
    revalidatePath("/tulisan");
    revalidatePath("/admin");
    revalidatePath("/admin/tulisan");
    revalidatePath(`/tulisan/${post.slug}`);

    return ok({ success: true }, {});
  } catch (error) {
    return handleApiError(error);
  }
}

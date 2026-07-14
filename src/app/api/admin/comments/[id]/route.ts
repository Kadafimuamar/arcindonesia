import { revalidatePath } from "next/cache";
import { fail, ok } from "@/lib/api/http";
import { handleApiError } from "@/lib/api/guards";
import { requireAdminApi } from "@/lib/security/auth";
import { idParamSchema } from "@/lib/validation/common";
import { createServices } from "@/services";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdminApi();

  if (admin.kind === "unauthorized") {
    return fail("UNAUTHORIZED", "Silakan login terlebih dahulu.", 401);
  }

  if (admin.kind === "forbidden") {
    return fail("FORBIDDEN", "Anda tidak memiliki akses admin.", 403);
  }

  try {
    const { id } = idParamSchema.parse(await params);
    const status = new URL(request.url).searchParams.get("status") === "visible" ? "visible" : "hidden";
    const services = createServices(admin.supabase);
    const comment = await services.comments.setStatus(id, status);
    revalidatePath("/admin/komentar");

    return ok(comment, {});
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
    await services.comments.remove(id);
    revalidatePath("/admin/komentar");

    return ok({ success: true }, {});
  } catch (error) {
    return handleApiError(error);
  }
}

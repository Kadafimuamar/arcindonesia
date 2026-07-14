import { revalidatePath } from "next/cache";
import { fail, ok } from "@/lib/api/http";
import { requireAdminApi } from "@/lib/security/auth";
import { idParamSchema } from "@/lib/validation/common";
import { createServices } from "@/services";

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdminApi();

  if (admin.kind === "unauthorized") {
    return fail("UNAUTHORIZED", "Silakan login terlebih dahulu.", 401);
  }

  if (admin.kind === "forbidden") {
    return fail("FORBIDDEN", "Anda tidak memiliki akses admin.", 403);
  }

  const { id } = idParamSchema.parse(await params);
  const services = createServices(admin.supabase);
  const post = await services.posts.setStatus(id, "draft");
  revalidatePath("/");
  revalidatePath("/tulisan");
  revalidatePath("/admin");
  revalidatePath("/admin/tulisan");
  revalidatePath(`/tulisan/${post.slug}`);

  return ok(post, {});
}

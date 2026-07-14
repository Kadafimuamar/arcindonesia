import { slugParamSchema } from "@/lib/validation/common";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createServices } from "@/services";
import { fail, ok } from "@/lib/api/http";
import { handleApiError } from "@/lib/api/guards";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = slugParamSchema.parse(await params);
    const services = createServices(await createSupabaseServerClient());
    const post = await services.posts.getPublicDetail(slug);

    if (!post) {
      return fail("NOT_FOUND", "Tulisan tidak ditemukan.", 404);
    }

    return ok(post, {});
  } catch (error) {
    return handleApiError(error);
  }
}

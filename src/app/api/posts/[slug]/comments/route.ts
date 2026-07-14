import { slugParamSchema } from "@/lib/validation/common";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createServices } from "@/services";
import { fail, ok } from "@/lib/api/http";
import { handleApiError } from "@/lib/api/guards";
import { hashRequestIp } from "@/lib/security/ip";
import { assertSameOrigin } from "@/lib/security/origin";
import { revalidatePath } from "next/cache";

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = slugParamSchema.parse(await params);
    const { searchParams } = new URL(request.url);
    const services = createServices(await createSupabaseServerClient());
    const post = await services.posts.getPublicDetail(slug);

    if (!post) {
      return fail("NOT_FOUND", "Tulisan tidak ditemukan.", 404);
    }

    const comments = await services.comments.listVisible(post.id, searchParams.get("page") ?? undefined, searchParams.get("pageSize") ?? undefined);
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

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await assertSameOrigin();
    const { slug } = slugParamSchema.parse(await params);
    const services = createServices(await createSupabaseServerClient());
    const post = await services.posts.getPublicDetail(slug);

    if (!post) {
      return fail("NOT_FOUND", "Tulisan tidak ditemukan.", 404);
    }

    const body = (await request.json()) as unknown;
    const comment = await services.comments.create(post.id, body, await hashRequestIp());
    revalidatePath(`/tulisan/${slug}`);

    return ok(comment, {}, 201);
  } catch (error) {
    return handleApiError(error);
  }
}

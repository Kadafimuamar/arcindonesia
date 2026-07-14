import { postQuerySchema } from "@/lib/validation/post";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createServices } from "@/services";
import { ok } from "@/lib/api/http";
import { handleApiError } from "@/lib/api/guards";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = postQuerySchema.parse({
      q: searchParams.get("q") ?? undefined,
      page: searchParams.get("page") ?? undefined,
      pageSize: searchParams.get("pageSize") ?? undefined,
      sort: searchParams.get("sort") ?? undefined,
    });
    const services = createServices(await createSupabaseServerClient());
    const posts = await services.posts.searchPublic(query);

    return ok(posts.items, {
      page: posts.page,
      pageSize: posts.pageSize,
      total: posts.total,
      totalPages: posts.totalPages,
      query: query.q ?? "",
    });
  } catch (error) {
    return handleApiError(error);
  }
}

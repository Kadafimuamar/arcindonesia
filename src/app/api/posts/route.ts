import { postQuerySchema } from "@/lib/validation/post";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createServices } from "@/services";
import { ok } from "@/lib/api/http";
import { handleApiError } from "@/lib/api/guards";
import { getSearchParamsValue } from "@/lib/utils/request";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = postQuerySchema.parse({
      q: getSearchParamsValue(searchParams.getAll("q") as never),
      page: searchParams.get("page") ?? undefined,
      pageSize: searchParams.get("pageSize") ?? undefined,
      sort: searchParams.get("sort") ?? undefined,
    });
    const services = createServices(await createSupabaseServerClient());
    const posts = await services.posts.listPublic(query);

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

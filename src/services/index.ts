import { SupabaseCommentsRepository } from "@/repositories/comments-repository";
import { SupabaseDashboardRepository } from "@/repositories/dashboard-repository";
import { SupabasePostsRepository } from "@/repositories/posts-repository";
import { CommentsService } from "@/services/comments-service";
import { DashboardService } from "@/services/dashboard-service";
import { PostsService } from "@/services/posts-service";

export function createServices(supabase: unknown) {
  const client = supabase as any;
  const postsRepository = new SupabasePostsRepository(client);
  const commentsRepository = new SupabaseCommentsRepository(client);
  const dashboardRepository = new SupabaseDashboardRepository(client);

  return {
    posts: new PostsService(postsRepository),
    comments: new CommentsService(commentsRepository),
    dashboard: new DashboardService(dashboardRepository),
  };
}

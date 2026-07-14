import { DashboardCards } from "@/components/admin/dashboard-cards";
import { Card, CardContent } from "@/components/ui/card";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createServices } from "@/services";
import { formatDate } from "@/lib/utils/date";

export default async function AdminDashboardPage() {
  const services = createServices(await createSupabaseServerClient());
  const stats = await services.dashboard.getStats();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">Dashboard</p>
        <h1 className="font-serif text-4xl font-semibold text-primary">Ringkasan editorial</h1>
      </div>
      <DashboardCards stats={stats} />
      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardContent className="space-y-4">
            <h2 className="font-serif text-2xl font-semibold text-primary">Tulisan terbaru</h2>
            <div className="space-y-3">
              {stats.recentPosts.map((post) => (
                <div key={post.id} className="rounded-2xl border border-border p-4">
                  <p className="font-semibold text-primary">{post.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {post.status} • {formatDate(post.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-4">
            <h2 className="font-serif text-2xl font-semibold text-primary">Komentar terbaru</h2>
            <div className="space-y-3">
              {stats.recentComments.map((comment) => (
                <div key={comment.id} className="rounded-2xl border border-border p-4">
                  <p className="font-semibold text-primary">{comment.authorName}</p>
                  <p className="text-sm text-muted-foreground">
                    {comment.postTitle ?? "Tulisan"} • {formatDate(comment.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

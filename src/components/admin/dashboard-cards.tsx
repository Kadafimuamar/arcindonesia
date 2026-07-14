import { Card, CardContent } from "@/components/ui/card";
import type { DashboardStats } from "@/types/domain";

const statItems = (stats: DashboardStats) => [
  { label: "Semua tulisan", value: stats.totalPosts },
  { label: "Published", value: stats.publishedPosts },
  { label: "Draft", value: stats.draftPosts },
  { label: "Archived", value: stats.archivedPosts },
  { label: "Komentar", value: stats.totalComments },
];

export function DashboardCards({ stats }: { stats: DashboardStats }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      {statItems(stats).map((item) => (
        <Card key={item.label}>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">{item.label}</p>
            <p className="font-serif text-4xl font-semibold text-primary">{item.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

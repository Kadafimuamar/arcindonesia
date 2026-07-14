import Link from "next/link";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: Props) {
  return (
    <div className="rounded-[32px] border border-dashed border-border bg-card p-10 text-center">
      <SearchX className="mx-auto mb-4 h-10 w-10 text-accent" />
      <h2 className="font-serif text-3xl font-semibold text-primary">{title}</h2>
      <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-muted-foreground">{description}</p>
      <Button asChild variant="outline" className="mt-6">
        <Link href="/tulisan">Lihat semua tulisan</Link>
      </Button>
    </div>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";

type Props = {
  page: number;
  totalPages: number;
  hrefBuilder: (page: number) => string;
};

export function PaginationControls({ page, totalPages, hrefBuilder }: Props) {
  return (
    <div className="flex items-center justify-between gap-4">
      <Button asChild variant="outline" disabled={page <= 1}>
        <Link href={hrefBuilder(Math.max(1, page - 1))}>Sebelumnya</Link>
      </Button>
      <p className="text-sm text-muted-foreground">
        Halaman {page} dari {totalPages}
      </p>
      <Button asChild variant="outline" disabled={page >= totalPages}>
        <Link href={hrefBuilder(Math.min(totalPages, page + 1))}>Berikutnya</Link>
      </Button>
    </div>
  );
}

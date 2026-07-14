import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "h-12 rounded-2xl border border-input bg-card px-4 py-3 text-sm text-foreground",
        props.className,
      )}
    />
  );
}

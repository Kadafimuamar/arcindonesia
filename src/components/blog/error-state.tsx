import { AlertTriangle } from "lucide-react";

export function ErrorState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-[32px] border border-danger/30 bg-red-50 p-8">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-1 h-5 w-5 text-danger" />
        <div>
          <h2 className="font-serif text-2xl font-semibold text-primary">{title}</h2>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
}

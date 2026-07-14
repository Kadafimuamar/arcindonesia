"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";

type Props = {
  action: string;
  confirmTitle: string;
  confirmDescription: string;
  endpoint: string;
  method?: "POST" | "PATCH" | "DELETE";
  variant?: "primary" | "accent" | "outline" | "ghost" | "danger";
};

export function ConfirmActionButton({
  action,
  confirmTitle,
  confirmDescription,
  endpoint,
  method = "POST",
  variant = "outline",
}: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runAction() {
    setSubmitting(true);
    setError(null);

    const response = await fetch(endpoint, { method });
    const payload = (await response.json().catch(() => null)) as { error?: { message?: string } } | null;

    setSubmitting(false);

    if (!response.ok) {
      setError(payload?.error?.message ?? "Aksi gagal diproses.");
      return;
    }

    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant={variant} size="sm">
          {action}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{confirmTitle}</DialogTitle>
          <DialogDescription>{confirmDescription}</DialogDescription>
        </DialogHeader>
        {error ? <p className="mb-4 text-sm text-danger">{error}</p> : null}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
            Batal
          </Button>
          <Button type="button" variant={variant === "danger" ? "danger" : "accent"} onClick={runAction} disabled={submitting}>
            {submitting ? <Spinner /> : null}
            Lanjutkan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { commentInputSchema } from "@/lib/validation/comment";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  slug: string;
};

type FormValues = z.infer<typeof commentInputSchema>;

export function CommentForm({ slug }: Props) {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(commentInputSchema),
    defaultValues: {
      authorName: "",
      authorEmail: "",
      content: "",
      website: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setMessage(null);
    setError(null);

    const response = await fetch(`/api/posts/${slug}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    const payload = (await response.json()) as { error: { message: string } | null };

    if (!response.ok) {
      setError(payload.error?.message ?? "Gagal mengirim komentar.");
      return;
    }

    form.reset();
    setMessage("Komentar berhasil dikirim.");
  }

  return (
    <form className="space-y-5 rounded-[32px] border border-border bg-card p-6 shadow-soft" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <h3 className="font-serif text-2xl font-semibold text-primary">Tinggalkan komentar</h3>
        <p className="text-sm text-muted-foreground">Komentar baru akan langsung tampil selama lolos validasi dan rate limit.</p>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="authorName">Nama</Label>
          <Input id="authorName" {...form.register("authorName")} />
          <p className="text-xs text-danger">{form.formState.errors.authorName?.message}</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="authorEmail">Email</Label>
          <Input id="authorEmail" type="email" {...form.register("authorEmail")} />
          <p className="text-xs text-danger">{form.formState.errors.authorEmail?.message}</p>
        </div>
      </div>
      <input type="text" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" {...form.register("website")} />
      <div className="space-y-2">
        <Label htmlFor="content">Komentar</Label>
        <Textarea id="content" rows={6} {...form.register("content")} />
        <p className="text-xs text-danger">{form.formState.errors.content?.message}</p>
      </div>
      {message ? <p className="text-sm text-success">{message}</p> : null}
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <Button type="submit" variant="accent" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? <Spinner /> : null}
        Kirim komentar
      </Button>
    </form>
  );
}

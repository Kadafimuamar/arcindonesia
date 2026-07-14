"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { MarkdownContent } from "@/components/blog/markdown-content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { createSlug } from "@/lib/utils/slug";
import { postInputSchema } from "@/lib/validation/post";
import type { PostRecord } from "@/types/domain";

type FormValues = z.infer<typeof postInputSchema>;

type Props = {
  post?: PostRecord | null;
};

export function PostEditorForm({ post }: Props) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(postInputSchema),
    defaultValues: {
      title: post?.title ?? "",
      slug: post?.slug ?? "",
      excerpt: post?.excerpt ?? "",
      content: post?.content ?? "",
      coverImageUrl: post?.coverImageUrl ?? null,
      status: post?.status ?? "draft",
      seoTitle: post?.seoTitle ?? "",
      seoDescription: post?.seoDescription ?? "",
    },
  });

  const contentPreview = form.watch("content");

  useEffect(() => {
    const subscription = form.watch((value, info) => {
      if (info.name === "title" && !post) {
        form.setValue("slug", createSlug(value.title ?? ""), { shouldValidate: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [form, post]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!form.formState.isDirty) {
        return;
      }

      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [form.formState.isDirty]);

  const endpoint = useMemo(() => (post ? `/api/admin/posts/${post.id}` : "/api/admin/posts"), [post]);
  const method = post ? "PATCH" : "POST";

  async function handleUpload(fileList: FileList | null) {
    const file = fileList?.[0];

    if (!file) {
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/admin/uploads/cover", {
      method: "POST",
      body: formData,
    });
    const payload = (await response.json()) as { data: { url?: string } | null; error: { message?: string } | null };
    setUploading(false);

    if (!response.ok || !payload.data?.url) {
      setError(payload.error?.message ?? "Upload cover gagal.");
      return;
    }

    form.setValue("coverImageUrl", payload.data.url, { shouldDirty: true });
  }

  async function onSubmit(values: FormValues) {
    setMessage(null);
    setError(null);

    const response = await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    const payload = (await response.json()) as { error: { message?: string } | null };

    if (!response.ok) {
      setError(payload.error?.message ?? "Gagal menyimpan tulisan.");
      return;
    }

    setMessage(post ? "Tulisan berhasil diperbarui." : "Tulisan berhasil dibuat.");
    router.push("/admin/tulisan");
    router.refresh();
  }

  return (
    <form className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-6 rounded-[32px] border border-border bg-card p-6 shadow-soft">
        <div className="space-y-2">
          <Label htmlFor="title">Judul</Label>
          <Input id="title" {...form.register("title")} />
          <p className="text-xs text-danger">{form.formState.errors.title?.message}</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" {...form.register("slug")} />
          <p className="text-xs text-danger">{form.formState.errors.slug?.message}</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="excerpt">Ringkasan</Label>
          <Textarea id="excerpt" rows={4} {...form.register("excerpt")} />
          <p className="text-xs text-danger">{form.formState.errors.excerpt?.message}</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="content">Konten Markdown</Label>
          <Textarea id="content" rows={18} {...form.register("content")} />
          <p className="text-xs text-danger">{form.formState.errors.content?.message}</p>
        </div>
      </div>
      <div className="space-y-6">
        <div className="space-y-6 rounded-[32px] border border-border bg-card p-6 shadow-soft">
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select id="status" {...form.register("status")}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="coverImage">Cover image</Label>
            <Input id="coverImage" type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => void handleUpload(event.target.files)} />
            {uploading ? <p className="text-sm text-muted-foreground">Mengunggah cover...</p> : null}
            {form.watch("coverImageUrl") ? (
              <div className="space-y-2">
                <Input value={form.watch("coverImageUrl") ?? ""} readOnly />
                <Button type="button" variant="ghost" onClick={() => form.setValue("coverImageUrl", null, { shouldDirty: true })}>
                  Hapus cover
                </Button>
              </div>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="seoTitle">SEO Title</Label>
            <Input id="seoTitle" {...form.register("seoTitle")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seoDescription">SEO Description</Label>
            <Textarea id="seoDescription" rows={4} {...form.register("seoDescription")} />
          </div>
          {message ? <p className="text-sm text-success">{message}</p> : null}
          {error ? <p className="text-sm text-danger">{error}</p> : null}
          <div className="flex flex-wrap gap-3">
            <Button type="submit" variant="accent" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? <Spinner /> : null}
              {post ? "Update tulisan" : "Simpan tulisan"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => form.setValue("status", "draft", { shouldDirty: true, shouldValidate: true })}
            >
              Simpan sebagai draft
            </Button>
          </div>
        </div>
        <div className="space-y-4 rounded-[32px] border border-border bg-card p-6 shadow-soft">
          <div>
            <h3 className="font-serif text-2xl font-semibold text-primary">Preview live</h3>
            <p className="text-sm text-muted-foreground">Markdown dirender tanpa raw HTML untuk menjaga keamanan.</p>
          </div>
          <MarkdownContent content={contentPreview || "Tulis konten markdown untuk melihat preview di sini."} />
        </div>
      </div>
    </form>
  );
}

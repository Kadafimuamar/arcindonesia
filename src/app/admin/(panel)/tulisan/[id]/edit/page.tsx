import { notFound } from "next/navigation";
import { PostEditorForm } from "@/components/admin/post-editor-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createServices } from "@/services";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const services = createServices(await createSupabaseServerClient());
  const post = await services.posts.getAdminDetail(id);

  if (!post) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">Admin</p>
        <h1 className="font-serif text-4xl font-semibold text-primary">Edit tulisan</h1>
      </div>
      <PostEditorForm post={post} />
    </div>
  );
}

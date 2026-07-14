import { PostEditorForm } from "@/components/admin/post-editor-form";

export default function NewPostPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">Admin</p>
        <h1 className="font-serif text-4xl font-semibold text-primary">Tambah tulisan</h1>
      </div>
      <PostEditorForm />
    </div>
  );
}

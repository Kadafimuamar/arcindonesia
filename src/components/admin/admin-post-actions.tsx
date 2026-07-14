import { ConfirmActionButton } from "@/components/admin/confirm-action-button";

export function AdminPostActions({ id }: { id: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      <ConfirmActionButton
        action="Publish"
        confirmTitle="Publish tulisan"
        confirmDescription="Tulisan ini akan tampil di halaman publik."
        endpoint={`/api/admin/posts/${id}/publish`}
        variant="accent"
      />
      <ConfirmActionButton
        action="Draft"
        confirmTitle="Ubah ke draft"
        confirmDescription="Tulisan akan disembunyikan dari publik."
        endpoint={`/api/admin/posts/${id}/draft`}
      />
      <ConfirmActionButton
        action="Archive"
        confirmTitle="Arsipkan tulisan"
        confirmDescription="Tulisan tidak akan tampil di publik dan tetap tersimpan."
        endpoint={`/api/admin/posts/${id}/archive`}
      />
      <ConfirmActionButton
        action="Delete"
        confirmTitle="Hapus tulisan"
        confirmDescription="Tindakan ini akan menandai tulisan sebagai terhapus."
        endpoint={`/api/admin/posts/${id}`}
        method="DELETE"
        variant="danger"
      />
    </div>
  );
}

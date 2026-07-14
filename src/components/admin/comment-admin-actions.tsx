import { ConfirmActionButton } from "@/components/admin/confirm-action-button";

export function CommentAdminActions({ id }: { id: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      <ConfirmActionButton
        action="Hide"
        confirmTitle="Sembunyikan komentar"
        confirmDescription="Komentar tidak akan tampil di halaman publik."
        endpoint={`/api/admin/comments/${id}`}
        method="PATCH"
      />
      <ConfirmActionButton
        action="Delete"
        confirmTitle="Hapus komentar"
        confirmDescription="Komentar akan ditandai sebagai terhapus."
        endpoint={`/api/admin/comments/${id}`}
        method="DELETE"
        variant="danger"
      />
    </div>
  );
}

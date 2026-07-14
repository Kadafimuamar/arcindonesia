"use client";

import { ConfirmActionButton } from "@/components/admin/confirm-action-button";

export function CommentStatusActionButton({ id, status }: { id: string; status: "visible" | "hidden" }) {
  const nextStatus = status === "visible" ? "hidden" : "visible";
  const action = status === "visible" ? "Hide" : "Restore";

  return (
    <ConfirmActionButton
      action={action}
      confirmTitle={status === "visible" ? "Sembunyikan komentar" : "Pulihkan komentar"}
      confirmDescription={
        status === "visible" ? "Komentar akan disembunyikan dari publik." : "Komentar akan tampil kembali di publik."
      }
      endpoint={`/api/admin/comments/${id}?status=${nextStatus}`}
      method="PATCH"
      variant="outline"
    />
  );
}

import { randomUUID } from "node:crypto";
import { POST_COVER_BUCKET } from "@/lib/utils/constants";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 2 * 1024 * 1024;

export function validateCoverFile(file: File): void {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error("Format cover harus JPG, PNG, atau WebP.");
  }

  if (file.size > MAX_BYTES) {
    throw new Error("Ukuran cover maksimal 2 MB.");
  }
}

export function createSafeCoverPath(filename: string): string {
  const sanitized = filename
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return `${POST_COVER_BUCKET}/${randomUUID()}-${sanitized || "cover"}`;
}

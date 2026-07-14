import { fail, ok } from "@/lib/api/http";
import { handleApiError } from "@/lib/api/guards";
import { requireAdminApi } from "@/lib/security/auth";
import { createSafeCoverPath, validateCoverFile } from "@/lib/security/uploads";
import { POST_COVER_BUCKET } from "@/lib/utils/constants";

export async function POST(request: Request) {
  const admin = await requireAdminApi();

  if (admin.kind === "unauthorized") {
    return fail("UNAUTHORIZED", "Silakan login terlebih dahulu.", 401);
  }

  if (admin.kind === "forbidden") {
    return fail("FORBIDDEN", "Anda tidak memiliki akses admin.", 403);
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return fail("VALIDATION_ERROR", "File cover wajib diunggah.", 400);
    }

    validateCoverFile(file);

    const path = createSafeCoverPath(file.name).replace(`${POST_COVER_BUCKET}/`, "");
    const buffer = await file.arrayBuffer();
    const { error } = await admin.supabase.storage.from(POST_COVER_BUCKET).upload(path, buffer, {
      contentType: file.type,
      upsert: false,
    });

    if (error) {
      return fail("UPLOAD_ERROR", "Gagal mengunggah cover image.", 400);
    }

    const { data } = admin.supabase.storage.from(POST_COVER_BUCKET).getPublicUrl(path);

    return ok({ url: data.publicUrl }, {}, 201);
  } catch (error) {
    return handleApiError(error);
  }
}

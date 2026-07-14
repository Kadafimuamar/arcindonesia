import { ZodError } from "zod";
import { fail } from "@/lib/api/http";

export function handleApiError(error: unknown) {
  if (error instanceof ZodError) {
    return fail("VALIDATION_ERROR", error.issues[0]?.message ?? "Input tidak valid.", 400);
  }

  if (error instanceof Error) {
    return fail("REQUEST_ERROR", error.message, 400);
  }

  return fail("INTERNAL_ERROR", "Terjadi kesalahan internal.", 500);
}

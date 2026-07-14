import { z } from "zod";
import { createSlug } from "@/lib/utils/slug";

export const postStatusSchema = z.enum(["draft", "published", "archived"]);

export const postInputSchema = z.object({
  title: z.string().trim().min(3, "Judul minimal 3 karakter.").max(200, "Judul maksimal 200 karakter."),
  slug: z
    .string()
    .trim()
    .min(3, "Slug minimal 3 karakter.")
    .max(220, "Slug maksimal 220 karakter.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug hanya boleh huruf kecil, angka, dan tanda hubung."),
  excerpt: z.string().trim().min(10, "Ringkasan minimal 10 karakter."),
  content: z.string().trim().min(30, "Konten minimal 30 karakter."),
  status: postStatusSchema,
  seoTitle: z.string().trim().max(200).nullable().optional(),
  seoDescription: z.string().trim().max(320).nullable().optional(),
  coverImageUrl: z.string().url().nullable().optional(),
});

export const postQuerySchema = z.object({
  q: z.string().trim().max(120).optional(),
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().optional(),
  status: postStatusSchema.optional(),
  sort: z.enum(["latest", "oldest"]).optional(),
});

export function createPostDraftFromTitle(title: string) {
  return {
    title,
    slug: createSlug(title),
  };
}

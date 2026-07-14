import { z } from "zod";

export const commentInputSchema = z.object({
  authorName: z.string().trim().min(2, "Nama minimal 2 karakter.").max(80, "Nama maksimal 80 karakter."),
  authorEmail: z.string().trim().email("Email tidak valid.").max(254, "Email terlalu panjang."),
  content: z
    .string()
    .trim()
    .min(3, "Komentar minimal 3 karakter.")
    .max(1000, "Komentar maksimal 1.000 karakter."),
  website: z.string().max(0).optional().default(""),
});

export const commentAdminQuerySchema = z.object({
  q: z.string().trim().max(120).optional(),
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().optional(),
  status: z.enum(["visible", "hidden"]).optional(),
});

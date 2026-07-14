import { z } from "zod";

export const idParamSchema = z.object({
  id: z.string().uuid("ID tidak valid."),
});

export const slugParamSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(3, "Slug tidak valid.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug tidak valid."),
});

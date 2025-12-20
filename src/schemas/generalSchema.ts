import z from "zod";

export const pagQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  take: z.coerce.number().min(1).max(50).default(10),
});

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive({
    message: "ID inválido",
  }),
});

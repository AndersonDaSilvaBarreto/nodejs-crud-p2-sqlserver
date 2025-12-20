import { z } from "zod";

export const userCreateSchema = z.object({
  name: z.string().min(2, { message: "Nome deve ter no mínimo 2 caracteres" }),
  login_email: z.string().email({
    message: "Formato de email inválido",
  }),
  password: z
    .string()
    .min(6, { message: "Senha deve ter no mínimo 6 caracteres" }),
  user_type: z.enum(["admin", "regular"], {
    message: 'Tipo de usuário deve ser "admin" ou "regular"',
  }),
});

export const loginSchema = z.object({
  login_email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(1, { message: "Senha é obrigatória" }),
});

export const userUpdateSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Nome deve ter no mínimo 2 caracteres" })
    .optional(),
  login_email: z
    .string()
    .email({ message: "Formato de email inválido" })
    .optional(),
  password: z
    .string()
    .min(6, { message: "Senha deve ter no mínimo 6 caracteres" })
    .optional(),
  user_type: z.enum(["admin", "regular"]).optional(),
});



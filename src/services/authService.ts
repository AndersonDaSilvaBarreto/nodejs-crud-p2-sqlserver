import { prisma } from "../libs/prisma.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import type z from "zod";
import type { loginSchema } from "../schemas/userSchema.js";

type LoginType = z.infer<typeof loginSchema>;
export const login = async (data: LoginType) => {
  const { login_email, password } = data;

  const user = await prisma.sys_user.findUnique({
    where: {
      login_email,
    },
  });

  if (!user) {
    throw new Error("Usuário ou senha inválidos.");
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw new Error("Usuário ou senha inválidos.");
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    if (!secret) {
      throw new Error("JWT Secret não foi configurado no .env");
    }
  }

  const tokenPayload = {
    userId: user.id,
    role: user.user_type,
  };

  const token = jwt.sign(tokenPayload, secret, {
    expiresIn: "30m",
  });

  return token;
};

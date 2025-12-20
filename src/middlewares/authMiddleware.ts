import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

interface AuthPayload extends JwtPayload {
  userId: number;
  role: "admin" | "regular";
}
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Token não fornecido." });
  }

  const [type, token] = authorization.split(" ");

  if (type !== "Bearer" || !token) {
    return res.status(401).json({ error: "Formato do token inválido." });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ error: "JWT Secret não configurado." });
  }

  try {
    const payload = jwt.verify(token, secret) as AuthPayload;

    req.user = payload;

    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido ou expirado." });
  }
};

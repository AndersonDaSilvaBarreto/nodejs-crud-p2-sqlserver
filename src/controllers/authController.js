import { loginSchema } from "../schemas/userSchema.js";
import * as AuthService from "../services/authService.js";

export const login = async (req, res) => {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ errors: result.error.format() });
  }

  try {
    const token = await AuthService.login(result.data);

    res.status(200).json({ token });
  } catch (error) {
    if (
      error.message.includes("inválidos") ||
      error.message.includes("JWT Secret")
    ) {
      return res.status(401).json({ error: error.message });
    }

    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

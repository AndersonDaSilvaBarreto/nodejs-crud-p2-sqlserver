import type { Request, RequestHandler} from "express";
import { userCreateSchema, userUpdateSchema } from "../schemas/userSchema.js";
import * as UserService from "../services/userService.js";
import { pagQuerySchema, idParamSchema } from "../schemas/generalSchema.js";
export const create: RequestHandler = async (req, res) => {
  const result = userCreateSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      errors: result.error.issues,
    });
  }

  try {
    const newUser = await UserService.createUser(result.data);
    return res.status(201).json(newUser);
  } catch (error: any) {
    if (error.message === "E-mail já cadastrado.") {
      return res.status(409).json({ error: error.message });
    }

    console.log(error);

    res.status(500).json({ error: "Erro interno ao criar usuário." });
  }
};

export const update: RequestHandler = async (req, res) => {
  const idToGetResult = idParamSchema.safeParse(req.params);
  if (!idToGetResult.success) {
    return res.status(400).json({ errors: idToGetResult.error.issues });
  }
  if (!req.user) {
    return res.status(401).json({ error: "Não autenticado" });
  }
  const loggedUserId = req.user.userId;
  const loggedUserRole = req.user.role;
  
  if (loggedUserRole !== "admin" && idToGetResult.data.id !== loggedUserId) {
    // 403 Forbidden: Você está logado, mas não tem permissão
    return res.status(403).json({
      error: "Acesso negado. Você só pode editar seu próprio perfil.",
    });
  }

  const result = userUpdateSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ errors: result.error.issues });
  }

  try {
    const updatedUser = await UserService.updateUser(
      idToGetResult.data.id,
      result.data
    );
    res.status(200).json(updatedUser);
  } catch (error: any) {
    // 6. TRATAR ERROS (ex: e-mail duplicado)
    if (error.message.includes("e-mail já está em uso")) {
      return res.status(409).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

export const deleteUser: RequestHandler = async (req, res) => {
  const idToDeleteResult = idParamSchema.safeParse(req.params);
  if (!idToDeleteResult.success) {
    return res.status(400).json({ errors: idToDeleteResult.error.issues });
  }
  try {
    await UserService.deleteUser(idToDeleteResult.data.id);

    res.status(204).send();
  } catch (error: any) {
    if (error.message.includes("Usuário não encontrado")) {
      return res.status(404).json({ error: error.message });
    }

    console.error(error);
    res.status(500).json({ error: "Erro interno ao deletar usuário." });
  }
};

export const getAll: RequestHandler = async (req, res) => {
  const result = pagQuerySchema.safeParse(req.query);
  if (!result.success) {
    return res.status(400).json({ errors: result.error.issues });
  }
  try {
    const users = await UserService.getAllUsers(result.data);
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getById: RequestHandler = async (req, res) => {
  const idToGetResult = idParamSchema.safeParse(req.params);
  if (!idToGetResult.success) {
    return res.status(400).json({ errors: idToGetResult.error.issues });
  }
  try {
    const user = await UserService.getUserById(idToGetResult.data.id);
    res.status(200).json(user);
  } catch (error: any) {
    if (error.message.includes("Usuário não encontrado")) {
      return res.status(404).json({ error: error.message });
    }

    res.status(500).json({ error: error.message });
  }
};

import { userCreateSchema, userUpdateSchema } from "../schemas/userSchema.js";
import * as UserService from "../services/userService.js";

export const create = async (req, res) => {
  const result = userCreateSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      errors: result.error.format(),
    });
  }

  try {
    const newUser = await UserService.createUser(result.data);
    return res.status(201).json(newUser);
  } catch (error) {
    if (error.message === "E-mail já cadastrado.") {
      return res.status(409).json({ error: error.message });
    }

    console.log(error);

    res.status(500).json({ error: "Erro interno ao criar usuário." });
  }
};

export const update = async (req, res) => {
  const idToEdit = parseInt(req.params.id);

  const loggedUserId = req.user.userId;
  const loggedUserRole = req.user.role;

  if (loggedUserRole !== "admin" && idToEdit !== loggedUserId) {
    // 403 Forbidden: Você está logado, mas não tem permissão
    return res.status(403).json({
      error: "Acesso negado. Você só pode editar seu próprio perfil.",
    });
  }

  const result = userUpdateSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ errors: result.error.format() });
  }

  try {
    const updatedUser = await UserService.updateUser(idToEdit, result.data);
    res.status(200).json(updatedUser);
  } catch (error) {
    // 6. TRATAR ERROS (ex: e-mail duplicado)
    if (error.message.includes("e-mail já está em uso")) {
      return res.status(409).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const idToDelete = parseInt(req.params.id);

  try {
    await UserService.deleteUser(idToDelete);

    res.status(204).send();
  } catch (error) {
    if (error.message.includes("Usuário não encontrado")) {
      return res.status(404).json({ error: error.message });
    }

    console.error(error);
    res.status(500).json({ error: "Erro interno ao deletar usuário." });
  }
};

export const getAll = async (req, res) => {
  try {
    const users = await UserService.getAllUsers(req.query);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getById = async (req, res) => {
  const idToGet = parseInt(req.params.id);

  if (isNaN(idToGet)) {
    return res.status(400).json({ error: "ID inválido." });
  }

  try {
    const user = await UserService.getUserById(idToGet);
    res.status(200).json(user);
  } catch (error) {
    if (error.message.includes("Usuário não encontrado")) {
      return res.status(404).json({ error: error.message });
    }

    res.status(500).json({ error: error.message });
  }
};

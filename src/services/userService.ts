import { userUpdateSchema } from "./../schemas/userSchema.js";
import bcrypt from "bcryptjs";
import { prisma } from "../libs/prisma.js";
import { z } from "zod";
import { userCreateSchema } from "../schemas/userSchema.js";
import type { pagQuerySchema } from "../schemas/generalSchema.js";

type UserCreateType = z.infer<typeof userCreateSchema>;
export const createUser = async (data: UserCreateType) => {
  const { name, login_email, password, user_type } = data;

  const userExists = await prisma.sys_user.findUnique({
    where: {
      login_email: login_email,
    },
  });

  if (userExists) {
    throw new Error("E-mail já cadastrado.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.sys_user.create({
    data: {
      name: name,
      login_email: login_email,
      password: hashedPassword,
      user_type: user_type,
    },
    select: {
      id: true,
      name: true,
      login_email: true,
      user_type: true,
    },
  });
  return newUser;
};

type UpdateUserType = z.infer<typeof userUpdateSchema>;
export const updateUser = async (id: number, data: UpdateUserType) => {
  const { name, login_email, password, user_type } = data;

  let hashedPassword = undefined;
  if (password) {
    hashedPassword = await bcrypt.hash(password, 10);
  }

  try {
    const updateData: Record<string, any> = {};
    if (name !== undefined) updateData.name = name;
    if (login_email !== undefined) updateData.login_email = login_email;
    if (user_type !== undefined) updateData.user_type = user_type;
    if (hashedPassword !== undefined) updateData.password = hashedPassword;

    const updatedUser = await prisma.sys_user.update({
      where: {
        id: id,
      },
      data: updateData,

      select: {
        id: true,
        name: true,
        login_email: true,
        user_type: true,
      },
    });

    return updatedUser;
  } catch (error: any) {
    if (error.code === "P2002" && error.meta?.target?.includes("login_email")) {
      throw new Error("Este e-mail já está em uso por outra conta.");
    }
    throw new Error("Não foi possível atualizar o usuário.");
  }
};

export const deleteUser = async (id: number) => {
  const userExists = await prisma.sys_user.findUnique({
    where: { id },
  });

  if (!userExists) {
    throw new Error("Usuário não encontrado.");
  }

  try {
    await prisma.sys_user.delete({
      where: { id: id },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Não foi possível deletar o usuário.");
  }
};
type GetAllUsersType = z.infer<typeof pagQuerySchema>;
export const getAllUsers = async (query: GetAllUsersType) => {
  let page = query.page;
  let take = query.take;

  if (page <= 0) page = 1;
  if (take <= 0) take = 10;
  if (take > 50) take = 50;

  const skip = (page - 1) * take;

  const [totalItems, users] = await Promise.all([
    prisma.sys_user.count(),

    prisma.sys_user.findMany({
      skip: skip,
      take: take,

      select: {
        id: true,
        name: true,
        login_email: true,
        user_type: true,
      },
    }),
  ]);

  const totalPages = Math.ceil(totalItems / take);

  const result = {
    data: users,
    pagina_atual: page,
    total_elementos_na_pagina: users.length,
    total_elementos_no_banco: totalItems,
    total_paginas: totalPages,
  };

  return result;
};

export const getUserById = async (id: number) => {
  const user = await prisma.sys_user.findUnique({
    where: {
      id: id,
    },

    select: {
      id: true,
      name: true,
      login_email: true,
      user_type: true,
    },
  });

  if (!user) {
    throw new Error("Usuário não encontrado.");
  }

  return user;
};

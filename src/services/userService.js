import { prisma } from "../libs/prisma.js";
import bcrypt from "bcryptjs";
export const createUser = async (data) => {
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

export const updateUser = async (id, data) => {
  const { name, login_email, password, user_type } = data;

  let hashedPassword = undefined;
  if (password) {
    hashedPassword = await bcrypt.hash(password, 10);
  }

  try {
    const updatedUser = await prisma.sys_user.update({
      where: {
        id: id,
      },
      data: {
        name: name,
        login_email: login_email,
        user_type: user_type,
        password: hashedPassword,
      },

      select: {
        id: true,
        name: true,
        login_email: true,
        user_type: true,
      },
    });

    return updatedUser;
  } catch (error) {
    if (error.code === "P2002" && error.meta?.target?.includes("login_email")) {
      throw new Error("Este e-mail já está em uso por outra conta.");
    }
    throw new Error("Não foi possível atualizar o usuário.");
  }
};

export const deleteUser = async (id) => {
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

export const getAllUsers = async (query) => {
  const page = parseInt(query.page) || 1;
  const take = parseInt(query.take) || 10;

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

export const getUserById = async (id) => {
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

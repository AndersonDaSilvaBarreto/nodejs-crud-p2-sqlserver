import type z from "zod";
import { prisma } from "../libs/prisma.js";
import type { pagQuerySchema } from "../schemas/generalSchema.js";

type GetAllPassengersType = z.infer<typeof pagQuerySchema>;
export const getAllPassengers = async (query:GetAllPassengersType ) => {
  let page = query.page
  let take = query.take

  if (page <= 0) page = 1;
  if (take <= 0) take = 10;
  if (take > 50) take = 50;

  const skip = (page - 1) * take;

  const [totalItems, passengers] = await Promise.all([
    prisma.passenger.count(),

    prisma.passenger.findMany({
      skip: skip,
      take: take,
    }),
  ]);

  const totalPages = Math.ceil(totalItems / take);

  const result = {
    data: passengers,
    pagina_atual: page,
    total_elementos_na_pagina: passengers.length,
    total_elementos_no_banco: totalItems,
    total_paginas: totalPages,
  };

  return result;
};

export const getPassengerById = async (id: number) => {
  const passenger = await prisma.passenger.findUnique({
    where: { passenger_id: id },
  });
  if (!passenger) {
    throw new Error("Passageiro não encontrado.");
  }
  return passenger;
};

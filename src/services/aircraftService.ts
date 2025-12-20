import type z from "zod";
import { prisma } from "../libs/prisma.js";
import { pagQuerySchema } from "../schemas/generalSchema.js";

type GetAllAircraftType = z.infer<typeof pagQuerySchema>;
export const getAllAircraft = async (query: GetAllAircraftType) => {
  let page = query.page;
  let take = query.take;
  if (page <= 0) page = 1;
  if (take <= 0) take = 10;
  if (take > 50) take = 50; // Limite máximo

  const skip = (page - 1) * take;

  const [totalItems, aircrafts] = await Promise.all([
    prisma.aircraft.count(),

    prisma.aircraft.findMany({
      skip: skip,
      take: take,
    }),
  ]);

  const totalPages = Math.ceil(totalItems / take);

  const result = {
    data: aircrafts,
    pagina_atual: page,
    total_elementos_na_pagina: aircrafts.length,
    total_elementos_no_banco: totalItems,
    total_paginas: totalPages,
  };

  return result;
};

export const getAircraftById = async (id: number) => {
  const aircraft = await prisma.aircraft.findUnique({
    where: {
      aircraft_id: id,
    },
  });

  if (!aircraft) {
    throw new Error("Aeronave não encontrada.");
  }
  return aircraft;
};

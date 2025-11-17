import { prisma } from "../libs/prisma.js";

export const getAllAircraft = async (query) => {
  const page = parseInt(query.page) || 1;
  const take = parseInt(query.take) || 10; // 10 por página

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

export const getAircraftById = async (id) => {
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

import z from "zod";
import { prisma } from "../libs/prisma.js";
import type { pagQuerySchema } from "../schemas/generalSchema.js";
type GetAllFlightsType = z.infer<typeof pagQuerySchema>;
export const getAllFlights = async (query: GetAllFlightsType) => {
  let page = query.page;
  let take = query.take;

  if (page <= 0) page = 1;
  if (take <= 0) take = 10;
  if (take > 50) take = 50;

  const skip = (page - 1) * take;

  const [totalItems, flights] = await Promise.all([
    prisma.flight.count(),

    prisma.flight.findMany({
      skip: skip,
      take: take,
    }),
  ]);

  const totalPages = Math.ceil(totalItems / take);

  const result = {
    data: flights,
    pagina_atual: page,
    total_elementos_na_pagina: flights.length,
    total_elementos_no_banco: totalItems,
    total_paginas: totalPages,
  };

  return result;
};

export const getFlightById = async (id: number) => {
  const flight = await prisma.flight.findUnique({
    where: {
      flight_id: id,
    },
  });

  if (!flight) {
    throw new Error("Voo não encontrado.");
  }
  return flight;
};

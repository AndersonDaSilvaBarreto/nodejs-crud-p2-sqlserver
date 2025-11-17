import { prisma } from '../libs/prisma.js'; 

export const getAllBoardingPasses = async (query) => {
  const page = parseInt(query.page) || 1;
  const take = parseInt(query.take) || 10;

  if (page <= 0) page = 1;
  if (take <= 0) take = 10;
  if (take > 50) take = 50; 

  const skip = (page - 1) * take;

  const [totalItems, passes] = await Promise.all([
    
    prisma.boarding_pass.count(), 
    
    prisma.boarding_pass.findMany({
      skip: skip,
      take: take,
    })
    
  ]);

  const totalPages = Math.ceil(totalItems / take);

  const result = {
    data: passes,
    pagina_atual: page,
    total_elementos_na_pagina: passes.length,
    total_elementos_no_banco: totalItems,
    total_paginas: totalPages,
  };
  
  return result;
};

export const getBoardingPassById = async (id) => {
  const pass = await prisma.boarding_pass.findUnique({
    where: {
      boarding_pass_id: id 
    }
  });

  if (!pass) {
    throw new Error('Cartão de embarque não encontrado.');
  }
  return pass;
};


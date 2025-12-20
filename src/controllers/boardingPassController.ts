import type { Request, RequestHandler, Response } from "express";
import * as BoardingPassService from "../services/boardingPassService.js";
import { idParamSchema, pagQuerySchema } from "../schemas/generalSchema.js";

export const getAll: RequestHandler = async (req, res) => {
  const pagResult = pagQuerySchema.safeParse(req.query);
  if (!pagResult.success) {
    return res.status(400).json({ errors: pagResult.error.issues });
  }
  try {
    const passes = await BoardingPassService.getAllBoardingPasses(
      pagResult.data
    );
    res.status(200).json(passes);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getById: RequestHandler = async (req, res) => {
  const idResult = idParamSchema.safeParse(req.params);
  if (!idResult.success) {
    return res.status(400).json({ errors: idResult.error.issues });
  }

  try {
    const pass = await BoardingPassService.getBoardingPassById(
      idResult.data.id
    );
    res.status(200).json(pass);
  } catch (error: any) {
    if (error.message.includes("não encontrado")) {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

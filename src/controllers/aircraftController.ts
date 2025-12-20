import type { RequestHandler } from "express";
import * as AircraftService from "../services/aircraftService.js";
import { idParamSchema, pagQuerySchema } from "../schemas/generalSchema.js";

export const getAll: RequestHandler = async (req, res) => {
  const pagResult = pagQuerySchema.safeParse(req.query);
  if (!pagResult.success) {
    return res.status(400).json({ errors: pagResult.error.issues });
  }
  try {
    const aircrafts = await AircraftService.getAllAircraft(pagResult.data);
    res.status(200).json(aircrafts);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getById: RequestHandler = async (req, res) => {
  //Validação com Zod
  const idResult = idParamSchema.safeParse(req.params);
  if (!idResult.success) {
    return res.status(400).json({ errors: idResult.error.issues });
  }

  try {
    const aircraft = await AircraftService.getAircraftById(idResult.data.id);
    res.status(200).json(aircraft);
  } catch (error: any) {
    if (error.message.includes("não encontrada")) {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

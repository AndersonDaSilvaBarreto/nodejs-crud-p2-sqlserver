import type { Request, RequestHandler, Response } from "express";
import * as FlightService from "../services/flightService.js";
import { idParamSchema, pagQuerySchema } from "../schemas/generalSchema.js";

export const getAll: RequestHandler = async (req, res) => {
  const pagResult = pagQuerySchema.safeParse(req.query);
  if (!pagResult.success) {
    return res.status(400).json({ errors: pagResult.error.issues });
  }
  try {
    const flights = await FlightService.getAllFlights(pagResult.data);
    res.status(200).json(flights);
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
    const flight = await FlightService.getFlightById(idResult.data.id);
    res.status(200).json(flight);
  } catch (error: any) {
    if (error.message.includes("não encontrado")) {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

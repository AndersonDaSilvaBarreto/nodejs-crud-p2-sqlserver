import * as AircraftService from "../services/aircraftService.js";

export const getAll = async (req, res) => {
  try {
    const aircrafts = await AircraftService.getAllAircraft(req.query);
    res.status(200).json(aircrafts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getById = async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "ID inválido." });
  }

  try {
    const aircraft = await AircraftService.getAircraftById(id);
    res.status(200).json(aircraft);
  } catch (error) {
    if (error.message.includes("não encontrada")) {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

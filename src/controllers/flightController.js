import * as FlightService from "../services/flightService.js";

export const getAll = async (req, res) => {
  try {
    const flights = await FlightService.getAllFlights(req.query);
    res.status(200).json(flights);
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
    const flight = await FlightService.getFlightById(id);
    res.status(200).json(flight);
  } catch (error) {
    if (error.message.includes("não encontrado")) {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

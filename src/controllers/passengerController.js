import * as PassengerService from "../services/passengerService.js";
export const getAll = async (req, res) => {
  try {
    const passengers = await PassengerService.getAllPassengers(req.query);
    res.status(200).json(passengers);
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
    const passenger = await PassengerService.getPassengerById(id);
    res.status(200).json(passenger);
  } catch (error) {
    if (error.message.includes("não encontrado")) {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

import * as BoardingPassService from "../services/boardingPassService.js";

export const getAll = async (req, res) => {
  try {
    const passes = await BoardingPassService.getAllBoardingPasses(req.query);
    res.status(200).json(passes);
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
    const pass = await BoardingPassService.getBoardingPassById(id);
    res.status(200).json(pass);
  } catch (error) {
    if (error.message.includes("não encontrado")) {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

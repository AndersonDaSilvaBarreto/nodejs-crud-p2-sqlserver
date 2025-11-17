import * as ReportService from "../services/reportService.js";

export const getFullReport = async (req, res) => {
  try {
    const report = await ReportService.getFullReport();
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

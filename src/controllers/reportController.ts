import type { RequestHandler } from "express";
import * as ReportService from "../services/reportService.js";

export const getFullReport: RequestHandler = async (_req, res) => {
  try {
    const report = await ReportService.getFullReport();
    return res.status(200).json(report);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

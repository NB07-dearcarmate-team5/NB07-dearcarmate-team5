import { Request, Response } from "express";
import { getDashboardService } from "../services/dashboard.service";

export const getDashboard = async (req: Request, res: Response) => {
    const { companyId } = req.user!;
    const result = await getDashboardService(companyId);
    res.status(200).json(result);
}
import { Request, Response } from "express";

export const healthCheck = async (req: Request, res: Response): Promise<void> => {
  res.json({ status: "ok" });
};

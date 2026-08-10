import type { Request, Response } from "express";

export function checkHealth(req: Request, res: Response) {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
}
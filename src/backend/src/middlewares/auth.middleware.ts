import type {
  Request,
  Response,
  NextFunction,
} from "express";

import jwt from "jsonwebtoken";

import { env } from "../config/env.js";

interface AuthPayload {
  sub: string;
}

declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authorization = req.headers.authorization;

  if (!authorization) {
    res.status(401).json({
      error: "Não autorizado.",
    });
    return;
  }

  const [type, token] = authorization.split(" ");

  if (type !== "Bearer" || !token) {
    res.status(401).json({
      error: "Token inválido.",
    });
    return;
  }

  try {
    const payload = jwt.verify(
      token,
      env.JWT_SECRET,
    ) as AuthPayload;

    const userId = Number(payload.sub);

    if (!payload.sub || Number.isNaN(userId)) {
      res.status(401).json({
        error: "Token inválido.",
      });
      return;
    }

    req.userId = userId;

    next();
  } catch {
    res.status(401).json({
      error: "Token inválido ou expirado.",
    });
  }
}
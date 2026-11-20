import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { verifyAccessToken } from "../services/token.service.js";
import { verificarSessao } from "../services/sessao.service.js";
import { prisma } from "../lib/prisma.js";
import { HttpError } from "../utils/errors.js";

declare global {
  namespace Express {
    interface Request {
      userId?: number;
      tokenVersion?: number;
      sessaoId?: string;
    }
  }
}

export async function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  const match = /^Bearer ([^\s]+)$/i.exec(
    req.headers.authorization ?? "",
  );

  if (!match?.[1]) {
    throw new HttpError(
      401,
      "Sessão não identificada. Faça login novamente.",
    );
  }

  const payload = verifyAccessToken(match[1]);

  const user = await prisma.usuario.findUnique({
    where: {
      id_Usuario: payload.userId,
    },
    select: {
      tokenVersion: true,
    },
  });

  if (!user || user.tokenVersion !== payload.tokenVersion) {
    throw new HttpError(
      401,
      "Sessão encerrada. Faça login novamente.",
    );
  }

  const sessaoId = await verificarSessao(match[1], payload, req.get("user-agent"));
  if (!sessaoId) {
    throw new HttpError(401, "Sessão encerrada. Faça login novamente.");
  }

  req.userId = payload.userId;
  req.tokenVersion = payload.tokenVersion;
  req.sessaoId = sessaoId;

  next();
}

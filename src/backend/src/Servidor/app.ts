import express from "express";
import type { ErrorRequestHandler } from "express";

import routes from "../routes/index.js";
import { HttpError } from "../utils/errors.js";
import { env } from "../config/env.js";

const app = express();

app.disable("x-powered-by");
app.set("trust proxy", env.TRUST_PROXY_HOPS);
app.use((_req, res, next) => {
  res.set("X-Content-Type-Options", "nosniff");
  res.set("Referrer-Policy", "no-referrer");
  res.set("X-Frame-Options", "DENY");
  res.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  next();
});

const allowedOrigins = new Set(
  env.CORS_ORIGINS
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
);

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin) {
    res.vary("Origin");

    if (!allowedOrigins.has(origin)) {
      res.status(403).json({
        error: "Origem não permitida.",
      });

      return;
    }

    res.set("Access-Control-Allow-Origin", origin);

    res.set(
      "Access-Control-Allow-Methods",
      "GET,POST,PATCH,PUT,DELETE,OPTIONS"
    );

    res.set(
      "Access-Control-Allow-Headers",
      "Content-Type,Authorization"
    );

    res.set(
      "Access-Control-Expose-Headers",
      "Retry-After"
    );
  }

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  next();
});

app.use(
  express.json({
    limit: "16kb",
  })
);

app.use((_req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

app.use(routes);

// Mantém caminhos como /auth/login.
// Rotas de autenticação já são registradas em routes/index.ts.

app.use((_req, res) => {
  res.status(404).json({
    error: "Rota não encontrada.",
  });
});

const errorHandler: ErrorRequestHandler = (
  err,
  _req,
  res,
  _next
) => {
  if (err instanceof HttpError && ((err.status >= 400 && err.status < 500) || err.status === 502 || err.status === 503)) {
    res.status(err.status).json({
      error: err.message,
    });

    return;
  }

  if (err?.type === "entity.parse.failed") {
    res.status(400).json({
      error: "JSON inválido.",
    });

    return;
  }

  if (err?.type === "entity.too.large") {
    res.status(413).json({
      error: "Corpo da requisição muito grande.",
    });

    return;
  }

  // Não registrar err: alguns erros de validação carregam dados do request.
  console.error("Falha interna na API", {
    tipo: err instanceof Error ? err.name : "unknown",
  });

  res.status(500).json({
    error: "Erro interno. Tente novamente.",
  });
};

app.use(errorHandler);

export default app;

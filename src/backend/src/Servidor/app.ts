import express from "express";
import type { ErrorRequestHandler } from "express";

import routes from "../routes/index.js";
import authRoutes from "../routes/auth.routes.js";
import { HttpError } from "../utils/errors.js";

const app = express();

app.disable("x-powered-by");

app.use(express.json({
  limit: "16kb",
}));

app.use((_req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

app.use(routes);

// Preserva caminhos existentes, como /auth/login.
app.use("/auth", authRoutes);

const errorHandler: ErrorRequestHandler = (
  err,
  _req,
  res,
  _next,
) => {
  if (err instanceof HttpError) {
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

  // Não registrar corpo, senhas ou tokens.
  console.error(
    "Falha interna na API:",
    err?.name ?? "UnknownError",
  );

  res.status(500).json({
    error: "Erro interno. Tente novamente.",
  });
};

app.use(errorHandler);

export default app;
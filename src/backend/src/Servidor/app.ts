// monta o Express (middlewares, rotas) e exporta o app, mas não coloca ele pra escutar em nenhuma porta.

import express from "express";
import routes from "../routes/index.js";
import authRoutes from "../routes/auth.routes.js";
import meRoutes from "../routes/me.routes.js";

const app = express();

// Permite o Express entender JSON no corpo das requisições (req.body)
app.use(express.json());

// Todas as rotas da API entram por aqui
app.use(routes);
app.use("/auth", authRoutes);
app.use("/me", meRoutes);

export default app;
// monta o Express (middlewares, rotas) e exporta o app, mas não coloca ele pra escutar em nenhuma porta.

import express from "express";
import routes from "../routes/index.js";

const app = express();

// Permite o Express entender JSON no corpo das requisições (req.body)
app.use(express.json());

// Todas as rotas da API entram por aqui
app.use(routes);

export default app;
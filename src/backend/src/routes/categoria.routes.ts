import { Router } from "express";
import {criarCategoria, listarCategorias, buscarCategoria, atualizarCategoria, excluirCategoria} from "../controllers/categoria.controller.js";


const router = Router();

router.post("/", criarCategoria);
router.get("/", listarCategorias);
router.get("/:id", buscarCategoria);
router.put("/:id", atualizarCategoria);
router.delete("/:id", excluirCategoria);

export default router;

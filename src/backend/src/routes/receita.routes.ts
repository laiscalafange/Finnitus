import { Router } from "express";
import {criarReceita, listarReceitas, buscarReceita, atualizarReceita, excluirReceita} from "../controllers/receita.controller.js";




const router = Router();

router.post("/", criarReceita);
router.get("/", listarReceitas);
router.get("/:id", buscarReceita);
router.put("/:id", atualizarReceita);
router.delete("/:id", excluirReceita);

export default router;

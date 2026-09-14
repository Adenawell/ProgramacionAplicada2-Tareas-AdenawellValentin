import { Router } from "express";
import {
  listarTurnos,
  verSiguiente,
  contarEspera,
  crearTurno,
  llamarSiguiente,
  finalizarTurno
} from "../controllers/turno.controller.js";

import { validarTurno } from "../middleware/validation.middleware.js";

const router = Router();

router.get("/", listarTurnos);
router.get("/siguiente", verSiguiente);
router.get("/espera", contarEspera);
router.post("/", validarTurno, crearTurno);
router.put("/llamar", llamarSiguiente);
router.put("/:id/finalizar", finalizarTurno);

export default router;
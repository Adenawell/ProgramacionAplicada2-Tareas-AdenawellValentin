import { Router } from "express";
import {
    crearHabito,
    obtenerHabitos,
    registrarHabito,
    obtenerEstadisticas,
    eliminarHabito
} from "../controllers/habitos.controllers.js";

const router = Router();

router.post("/", crearHabito);
router.get("/", obtenerHabitos);
router.post("/:id/registrar", registrarHabito);
router.get("/:id/estadisticas", obtenerEstadisticas);
router.delete("/:id", eliminarHabito);

export default router;
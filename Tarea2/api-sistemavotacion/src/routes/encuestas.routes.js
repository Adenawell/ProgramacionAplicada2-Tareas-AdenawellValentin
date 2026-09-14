import {Router} from "express";
import {obtenerEncuestas , obtenerEncuestaId, crearEncuesta, actualizarEncuesta, eliminarEncuesta} from "../controllers/encuestas.controllers.js";
import { validarEncuesta } from "../middleware/validation.midleware.js";

const router = Router();

// Rutas para encuestas
router.get("/", obtenerEncuestas);
router.get("/:id", obtenerEncuestaId);
router.post("/", validarEncuesta, crearEncuesta);
router.put("/:id", validarEncuesta, actualizarEncuesta);
router.delete("/:id", eliminarEncuesta);

export default router;


import {Router} from "express";
import {obtenerEncuestas , obtenerEncuestaId, crearEncuesta, actualizarEncuesta, eliminarEncuesta} from "../controllers/encuestas.controller.js";
import {validarEncuesta} from "../validation.middleware.js";

const router = Router();

// Rutas para encuestas
router.get("/", obtenerEncuestas);
router.get("/:id", obtenerEncuestaId);
router.post("/", validarEncuesta, crearEncuesta);
router.put("/:id", validarEncuesta, actualizarEncuesta);
router.delete("/:id", eliminarEncuesta);

export default router;


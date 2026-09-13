import {Router} from "express";
import {getEncuestas, getEncuestaById, createEncuesta, updateEncuesta, deleteEncuesta} from "../controllers/encuestas.controller.js";
import {validateEncuesta} from "../middlewares/validateEncuesta.js";

const router = Router();

// Rutas para encuestas
router.get("/", getEncuestas);
router.get("/:id", getEncuestaById);
router.post("/", validateEncuesta, createEncuesta);
router.put("/:id", validateEncuesta, updateEncuesta);
router.delete("/:id", deleteEncuesta);

export default router;


import { Router } from "express";
import { listarInventario, crearProducto, entradaStock, salidaStock, obtenerAlertas } from "../controllers/controlinventory.controllers.js";
import { validarProducto, validarCantidad } from "../middleware/validation.middleware.js";

const router = Router();

router.get("/", listarInventario);
router.post("/", validarProducto, crearProducto);
router.get("/alertas", obtenerAlertas);
router.post("/:id/entrada", validarCantidad, entradaStock);
router.post("/:id/salida", validarCantidad, salidaStock);

export default router;
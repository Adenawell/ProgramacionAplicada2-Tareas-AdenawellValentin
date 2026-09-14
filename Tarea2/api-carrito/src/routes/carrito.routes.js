import { Router } from "express";
import {
  obtenerProductos,
  crearProducto,
  actualizarCantidad,
  eliminarProducto,
  obtenerTotalCarrito,
  aplicarDescuento
} from "../controllers/carrito.controllers.js";

import { 
  validarProducto, 
  validarCantidad,
  validarDescuento 
} from "../middleware/validation.middleware.js";

const router = Router();

// productos
router.get("/productos", obtenerProductos);
router.post("/productos", validarProducto, crearProducto);
router.put("/productos/:id", validarCantidad, actualizarCantidad);
router.delete("/productos/:id", eliminarProducto);

// carrito
router.get("/carrito/total", obtenerTotalCarrito);
router.post("/carrito/aplicar-descuento", validarDescuento, aplicarDescuento);

export default router;
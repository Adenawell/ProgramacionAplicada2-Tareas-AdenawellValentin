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
  validarCantidad 
} from "../middleware/validation.middleware.js";

const router = Router();

// Rutas de productos dentro del carrito
router.get("/productos", obtenerProductos);
router.post("/productos", validarProducto, crearProducto);
router.put("/productos/:id", validarCantidad, actualizarCantidad);
router.delete("/productos/:id", eliminarProducto);

// Rutas de totales y descuentos
router.get("/total", obtenerTotalCarrito);
router.post("/aplicar-descuento", aplicarDescuento);

export default router;
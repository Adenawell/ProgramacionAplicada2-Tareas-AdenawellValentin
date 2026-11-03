import express from 'express';
import { validarToken, soloAdmin } from '../middlewares/auth.middleware.js'; 
import { 
  crearReserva, obtenerMisReservas, obtenerTodas, cambiarEstado, cancelarReserva 
} from '../controllers/reservas.controller.js';

const router = express.Router();

// Clientes 
router.post('/', validarToken, crearReserva);
router.get('/mis-reservas', validarToken, obtenerMisReservas);
router.delete('/:id', validarToken, cancelarReserva);

// Admin 
router.get('/', validarToken, soloAdmin, obtenerTodas);
router.put('/:id/estado', validarToken, soloAdmin, cambiarEstado);

export default router;
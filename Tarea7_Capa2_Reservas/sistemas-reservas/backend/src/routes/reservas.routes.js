const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const esAdmin = require('../middlewares/esAdmin');
const { 
  crearReserva, obtenerMisReservas, obtenerTodas, cambiarEstado, cancelarReserva 
} = require('../controllers/reservasController');

// Clientes
router.post('/', auth, crearReserva);
router.get('/mis-reservas', auth, obtenerMisReservas);
router.delete('/:id', auth, cancelarReserva);

// Admin
router.get('/', auth, esAdmin, obtenerTodas);
router.put('/:id/estado', auth, esAdmin, cambiarEstado);

module.exports = router;
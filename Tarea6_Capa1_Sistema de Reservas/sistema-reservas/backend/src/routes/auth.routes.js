import { Router } from 'express';
import { registro, login } from './auth.controller.js';
import { validarRegistro, validarLogin } from './validaciones.middleware.js'; // Ajusta la ruta a tu archivo

const router = Router();

router.post('/registro', validarRegistro, registro);
router.post('/login', validarLogin, login);

export default router;
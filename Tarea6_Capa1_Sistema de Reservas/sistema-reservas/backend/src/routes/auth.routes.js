import { Router } from 'express';
import { login, register } from '../controllers/auth.controller.js';
import { validarRegistro, validarLogin } from '../middlewares/validaciones.middleware.js'; 

const router = Router();


router.post('/registro', validarRegistro, register);


router.post('/login', validarLogin, login);

export default router;
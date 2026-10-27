import { Router } from 'express';
import { obtenerServicios, crearServicio, editarServicio, eliminarServicio } from './servicios.controller.js';
import { validarToken, soloAdmin } from './auth.middleware.js';
import { validarCreacionYEdicionServicio, validarId } from './validaciones.middleware.js'; 

const router = Router();

// Todos los usuarios logueados pueden ver servicios
router.get('/', validarToken, obtenerServicios);

// Solo admin puede crear, pasamos primero por el token, luego por el rol y luego validamos los datos
router.post('/', validarToken, soloAdmin, validarCreacionYEdicionServicio, crearServicio);

// Solo admin puede editar, validamos id y datos
router.put('/:id', validarToken, soloAdmin, validarId, validarCreacionYEdicionServicio, editarServicio);

// Solo admin puede eliminar, validamos id
router.delete('/:id', validarToken, soloAdmin, validarId, eliminarServicio);

export default router;
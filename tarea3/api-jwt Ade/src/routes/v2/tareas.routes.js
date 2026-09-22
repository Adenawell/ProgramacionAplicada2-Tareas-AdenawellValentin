import express from 'express'
import { verificarToken } from '../../middlewares/auth.middleware.js'
import { createTarea, getTareas, updateTarea, deleteTarea } from '../../controllers/v2/tareas.controller.js'

const router = express.Router()

router.use(verificarToken)

router.get('/', getTareas)
router.post('/', createTarea)
router.put('/:id', updateTarea)
router.delete('/:id', deleteTarea)

export default router
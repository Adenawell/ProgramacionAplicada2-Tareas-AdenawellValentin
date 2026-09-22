import express from "express";
import { createTarea, getTareas } from "../../controllers/v1/tareas.controller.js";

const router = express.Router();


router.get("/", getTareas);
router.post("/", createTarea);

export default router;



import { prisma } from "../../db.js";

export const getTareas = async (req, res, next) => {
    try {
        const tareas = await prisma.tarea.findMany();
        res.json(tareas);
    } catch (error) {
        next(error);
    }
};

export const createTarea = async (req, res, next) => {
    const { titulo, usuarioId } = req.body;

    try {
        const tarea = await prisma.tarea.create({
            data: {
                titulo,
                usuarioId
            }
        });
        res.status(201).json(tarea);
    } catch (error) {
        next(error);
    }
};
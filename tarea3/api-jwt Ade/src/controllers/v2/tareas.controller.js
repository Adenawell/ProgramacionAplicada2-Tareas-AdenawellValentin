import { prisma } from "../../db.js";

export const getTareas = async (req, res, next) => {
    try {
        const regla = req.usuario.rol == "admin" ? {} : { usuarioId: req.usuario.id };
        const tareas = await prisma.tarea.findMany({
            where: regla
        });
        res.json(tareas);
    } catch (error) {
        next(error);
    }
};

export const createTarea = async (req, res, next) => {
    try {
        const tarea = await prisma.tarea.create({
            data: {
                titulo: req.body.titulo,
                usuarioId: req.usuario.id
            }
        });
        res.status(201).json(tarea);
    } catch (error) {
        next(error);
    }
};

export const updateTarea = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);

        if (!id) {
            return res.status(400).json({ error: "ID de tarea inválido" });
        }

        const tarea = await prisma.tarea.findUnique({
            where: { id }
        });

        if (!tarea) {
            return res.status(404).json({ error: "Tarea no encontrada" });
        }

        if (tarea.usuarioId !== req.usuario.id && req.usuario.rol !== "admin") {
            return res.status(403).json({ error: "No tienes permiso para actualizar esta tarea" });
        }
        
        const actualizada = await prisma.tarea.update({
            where: { id },
            data: {
                titulo: req.body.titulo,
                completada: req.body.completada
            }
        });
        res.status(200).json(actualizada);

    } catch (error) {
        next(error);
    }
};

export const deleteTarea = async (req, res, next) => {
    const id = parseInt(req.params.id);

    try {
        const tarea = await prisma.tarea.findUnique({
            where: { id }
        });

        if (!tarea) {
            return res.status(404).json({ error: "Tarea no encontrada" });
        }

        if (tarea.usuarioId !== req.usuario.id && req.usuario.rol !== "admin") {
            return res.status(403).json({ error: "No tienes permiso para eliminar esta tarea" });
        }

        await prisma.tarea.delete({
            where: { id }
        });
        res.status(200).json(tarea);

    } catch (error) {
        next(error);
    }
};
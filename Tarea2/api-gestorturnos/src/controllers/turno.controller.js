import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Crear turno para entrar a la cola con estado por defecto "esperando"
export const crearTurno = async (req, res) => {
    try {
        const { cliente, servicio } = req.body;

        if (!cliente || !servicio) {
            return res.status(400).json({ error: "Faltan datos" });
        }

        const nuevoTurno = await prisma.turno.create({
            data: {
                cliente,
                servicio,
                estado: "esperando"
            }
        });

        res.status(201).json(nuevoTurno);
    } catch (error) {
        res.status(500).json({ error: "Error al crear el turno" });
    }
};

// Ver todos los turnos ordenados
export const listarTurnos = async (req, res) => {
    try {
        const turnos = await prisma.turno.findMany({
            orderBy: { id: 'asc' }
        });
        res.json(turnos);
    } catch (error) {
        res.status(500).json({ error: "Error al listar los turnos" });
    }
};

// Ver quién es el proximo en turno
export const verSiguiente = async (req, res) => {
    try {
        const siguiente = await prisma.turno.findFirst({
            where: { estado: "esperando" },
            orderBy: { id: 'asc' }
        });
        
        if (!siguiente) {
            return res.status(404).json({ error: "No hay nadie en cola" });
        }
        
        res.json(siguiente);
    } catch (error) {
        res.status(500).json({ error: "Error al consultar el próximo turno" });
    }
};

// Ver cuantos estan esperando
export const contarEspera = async (req, res) => {
    try {
        const contador = await prisma.turno.count({
            where: { estado: "esperando" }
        });
        res.json({ esperando: contador });
    } catch (error) {
        res.status(500).json({ error: "Error al contar los turnos en espera" });
    }
};

// Llamar al siguiente
export const llamarSiguiente = async (req, res) => {
    try {
        const ocupado = await prisma.turno.findFirst({
            where: { estado: "atendiendo" }
        });
        
        if (ocupado) {
            return res.status(400).json({ error: "Ya hay un turno en atencion" });
        }


        const proximo = await prisma.turno.findFirst({
            where: { estado: "esperando" },
            orderBy: { id: 'asc' }
        });

        if (!proximo) {
            return res.status(404).json({ error: "Cola vacia" });
        }

        const turnoActualizado = await prisma.turno.update({
            where: { id: proximo.id },
            data: { estado: "atendiendo" }
        });

        res.json({ mensaje: "Turno llamado", turno: turnoActualizado });
    } catch (error) {
        res.status(500).json({ error: "Error al llamar al turno" });
    }
};

// Finalizar un turno
export const finalizarTurno = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const turno = await prisma.turno.findUnique({
            where: { id }
        });

        if (!turno) {
            return res.status(404).json({ error: "No existe" });
        }

        if (turno.estado !== "atendiendo") {
            return res.status(400).json({ error: "Solo puedes finalizar turnos en atencion" });
        }

        const turnoFinalizado = await prisma.turno.update({
            where: { id },
            data: { estado: "finalizado" }
        });

        res.json({ mensaje: "Turno terminado", turno: turnoFinalizado });
    } catch (error) {
        res.status(500).json({ error: "Error al finalizar el turno" });
    }
};
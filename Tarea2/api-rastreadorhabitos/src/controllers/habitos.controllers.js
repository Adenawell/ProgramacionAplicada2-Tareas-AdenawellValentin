import { db } from "../db.js";

// Crear habito
export const crearHabito = async (req, res) => {
    try {
        const { nombre, meta } = req.body;

        if (!nombre || !meta) {
            return res.status(400).json({ error: "Faltan datos" });
        }

        const fechaDeHoy = new Date().toISOString().split('T')[0];

        const nuevoHabito = await db.habito.create({
            data: {
                nombre,
                meta,
                fechaCreacion: fechaDeHoy
            }
        });

        res.status(201).json(nuevoHabito);
    } catch (error) {
        res.status(500).json({ error: "Error al crear habito" });
    }
};

// Listar habitos
export const obtenerHabitos = async (req, res) => {
    try {
        const habitos = await db.habito.findMany({
            include: { registros: true }
        });
        res.json(habitos);
    } catch (error) {
        res.status(500).json({ error: "Error al listar habitos" });
    }
};

// Registrar habito del dia
export const registrarHabito = async (req, res) => {
    try {
        const { id } = req.params;
        const hoy = new Date().toISOString().split('T')[0];

        const habito = await db.habito.findUnique({
            where: { id: Number(id) }
        });

        if (!habito) {
            return res.status(404).json({ error: "No existe el habito" });
        }

        const yaRegistrado = await db.registro.findFirst({
            where: {
                habitoId: Number(id),
                fecha: hoy
            }
        });

        if (yaRegistrado) {
            return res.status(400).json({ error: "Ya registraste esto hoy" });
        }

        const registro = await db.registro.create({
            data: {
                fecha: hoy,
                completado: true,
                habitoId: Number(id)
            }
        });

        res.json({ mensaje: "Registro guardado", registro });
    } catch (error) {
        res.status(500).json({ error: "Error al registrar habito" });
    }
};

// Estadisticas
export const obtenerEstadisticas = async (req, res) => {
    try {
        const { id } = req.params;
        const habito = await db.habito.findUnique({
            where: { id: Number(id) },
            include: { registros: { orderBy: { fecha: 'asc' } } }
        });

        if (!habito) return res.status(404).json({ error: "No existe el habito" });

        const hoy = new Date().toISOString().split('T')[0];

        // Funcion corta para sacar la diferencia en dias
        const diffDias = (d1, d2) => (new Date(d2) - new Date(d1)) / 86400000; 

        let rachaActual = 0, mejorRacha = 0, temporal = 0;
        const regs = habito.registros;

        if (regs.length > 0) {
            temporal = 1;
            mejorRacha = 1;

            for (let i = 1; i < regs.length; i++) {
                // Si la diferencia es 1 dia  suma a la racha, sino = 1
                temporal = diffDias(regs[i - 1].fecha, regs[i].fecha) === 1 ? temporal + 1 : 1;
                
                // Guarda el numero mayor entre la mejor racha guardada y la temporal
                mejorRacha = Math.max(mejorRacha, temporal); 
            }

            // Si el ultimo registro fue ayer o  hoy la racha sigue viva
            rachaActual = diffDias(regs[regs.length - 1].fecha, hoy) <= 1 ? temporal : 0;
        }

        const diasTotales = diffDias(habito.fechaCreacion, hoy) + 1;
        const porcentaje = diasTotales > 0 ? (regs.length / diasTotales) * 100 : 0;

        res.json({
            nombre: habito.nombre,
            rachaActual,
            mejorRacha,
            porcentaje: `${porcentaje.toFixed(2)}%`
        });
    } catch (error) {
        res.status(500).json({ error: "Error al calcular estadisticas" });
    }
};

// Eliminar habito
export const eliminarHabito = async (req, res) => {
    try {
        const { id } = req.params;

        await db.habito.delete({
            where: { id: Number(id) }
        });

        res.json({ mensaje: "Borrado exitosamente" });
    } catch (error) {
        res.status(400).json({ error: "No se pudo borrar o no existe" });
    }
};
import { prisma } from "../db.js";

// Registrar un nuevo cliente en la cola con estado esperando
export const crearTurno = async (req, res) => {
  try {
    const { cliente, servicio } = req.body;

    const nuevoTurno = await prisma.turno.create({
      data: {
        cliente,
        servicio,
        estado: "esperando"
      }
    });

    res.status(201).json(nuevoTurno);
  } catch (error) {
    console.error("Error al crear turno:", error);
    res.status(500).json({
      error: "Error interno al crear el turno"
    });
  }
};

// Devolver la lista completa de turnos ordenados por id
export const listarTurnos = async (req, res) => {
  try {
    const turnos = await prisma.turno.findMany({
      orderBy: { id: "asc" }
    });
    res.json(turnos);
  } catch (error) {
    console.error("Error al listar turnos:", error);
    res.status(500).json({
      error: "Error interno al listar los turnos"
    });
  }
};

// Devolver al siguiente cliente en espera sin cambiar su estado
export const verSiguiente = async (req, res) => {
  try {
    const siguiente = await prisma.turno.findFirst({
      where: { estado: "esperando" },
      orderBy: { id: "asc" }
    });

    if (!siguiente) {
      return res.status(404).json({
        error: "No hay nadie en cola"
      });
    }

    res.json(siguiente);
  } catch (error) {
    console.error("Error al consultar el proximo turno:", error);
    res.status(500).json({
      error: "Error interno al consultar el proximo turno"
    });
  }
};

// Devolver la cantidad de personas que siguen en espera
export const contarEspera = async (req, res) => {
  try {
    const contador = await prisma.turno.count({
      where: { estado: "esperando" }
    });
    res.json({ esperando: contador });
  } catch (error) {
    console.error("Error al contar los turnos en espera:", error);
    res.status(500).json({
      error: "Error interno al contar los turnos"
    });
  }
};

// Llamar al proximo turno y cambiarlo a estado atendiendo
export const llamarSiguiente = async (req, res) => {
  try {

    const ocupado = await prisma.turno.findFirst({
      where: { estado: "atendiendo" }
    });

    if (ocupado) {
      return res.status(400).json({
        error: "Ya hay un turno en atencion"
      });
    }

  
    const proximo = await prisma.turno.findFirst({
      where: { estado: "esperando" },
      orderBy: { id: "asc" }
    });

    if (!proximo) {
      return res.status(404).json({
        error: "Cola vacia"
      });
    }

    // Actualizar el estado del turno para pasarlo a atencion
    const turnoActualizado = await prisma.turno.update({
      where: { id: proximo.id },
      data: { estado: "atendiendo" }
    });

    res.json({
      mensaje: "Turno llamado",
      turno: turnoActualizado
    });
  } catch (error) {
    console.error("Error al llamar al turno:", error);
    res.status(500).json({
      error: "Error interno al llamar al turno"
    });
  }
};

// Finalizar el turno y devolver el registro actualizado
export const finalizarTurno = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        error: "El parametro ID debe ser un numero entero"
      });
    }

    const turno = await prisma.turno.findUnique({
      where: { id }
    });

    if (!turno) {
      return res.status(404).json({
        error: "No existe"
      });
    }

    // Verificar el turno antes de terminarlo
    if (turno.estado !== "atendiendo") {
      return res.status(400).json({
        error: "Solo puedes finalizar turnos en atencion"
      });
    }

    // Guardar el turno como finalizado 
    const turnoFinalizado = await prisma.turno.update({
      where: { id },
      data: { estado: "finalizado" }
    });

    res.json({
      mensaje: "Turno terminado",
      turno: turnoFinalizado
    });
  } catch (error) {
    console.error("Error al finalizar el turno:", error);
    res.status(500).json({
      error: "Error interno al finalizar el turno"
    });
  }
};
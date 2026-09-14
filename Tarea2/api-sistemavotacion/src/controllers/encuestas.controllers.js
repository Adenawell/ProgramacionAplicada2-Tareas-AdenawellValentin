import { db } from "../db.js";

//Obtener todas las encuestas
export const obtenerEncuestas = async (req, res) => {
  try {
    const encuestas = await db.encuesta.findMany({
      include: { opciones: true }
    });
    res.status(200).json(encuestas);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las encuestas" });
  }
};

//Obtener una encuesta por su ID
export const obtenerEncuestaId = async (req, res) => {
  try {
    const { id } = req.params;
    const encuesta = await db.encuesta.findUnique({
      where: { id: Number(id) },
      include: { opciones: true }
    });

    if (!encuesta) {
      return res.status(404).json({ error: "Encuesta no encontrada" });
    }

    res.status(200).json(encuesta);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la encuesta" });
  }
};


//Crear una nueva encuesta
export const crearEncuesta = async (req, res) => {
  try {
    const { pregunta, opciones } = req.body;

    const nuevaEncuesta = await db.encuesta.create({
      data: {
        pregunta,
        opciones: {
          create: opciones.map(op => ({
            name: (typeof op === "string" ? op : op.name).trim()
          }))
        }
      },
      include: { opciones: true }
    });

    res.status(201).json(nuevaEncuesta);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Error al crear la encuesta" });
  }
};

//Actualizar una encuesta existente
export const actualizarEncuesta = async (req, res) => {
  try {

    const { id } = req.params;
    const { pregunta } = req.body;

    
    const encuestaActualizada = await db.encuesta.update({
      where: { id: Number(id) },
      data: { pregunta }
    });

    res.status(200).json(encuestaActualizada);
  } catch (error) {
    res.status(400).json({ error: "Error al actualizar la encuesta animal verrifica que ese ID exista." });
  }
};

// Eliminar una encuesta
export const eliminarEncuesta = async (req, res) => {
  try {
    const { id } = req.params;
    
    await db.encuesta.delete({
      where: { id: Number(id) }
    });
    
    res.status(200).json({ mensaje: "Encuesta eliminada correctamente" });
  } catch (error) {
    res.status(400).json({ error: "Error al eliminar la encuesta" });
  }

};

// Registrar  voto
export const votarOpcion = async (req, res) => {
  try {
    const { id } = req.params;
    const { opcion } = req.body;

    if (!opcion || typeof opcion !== "string" || opcion.trim() === "") {
      return res.status(400).json({ error: " indica el nombre de la opcion" });
    }

    const opcionEncontrada = await db.opcion.findFirst({
      where: {
        encuestaId: Number(id),
        name: opcion.trim(),
      },
    });

    if (!opcionEncontrada) {
      return res.status(404).json({ error: "La opcion no existe en la encuesta" });
    }

    const opcionActualizada = await db.opcion.update({
      where: { id: opcionEncontrada.id },
      data: { votos: { increment: 1 } },
    });

    res.status(200).json({
      mensaje: "Voto registrado correctamente",
      opcion: opcionActualizada,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al registrar el voto" });
  }
};

// Obtener resultados con porcentajes
export const obtenerResultados = async (req, res) => {
  try {
    const { id } = req.params;

    const encuesta = await db.encuesta.findUnique({
      where: { id: Number(id) },
      include: { opciones: true },
    });

    if (!encuesta) {
      return res.status(404).json({ error: "Encuesta no encontrada" });
    }

    const totalVotos = encuesta.opciones.reduce((acc, op) => acc + op.votos, 0);

    const resultados = encuesta.opciones.map((op) => ({
      id: op.id,
      name: op.name,
      votos: op.votos,
      porcentaje: totalVotos > 0 ? Number(((op.votos / totalVotos) * 100).toFixed(2)) : 0,
    }));

    let ganador = "Sin votos ";
    if (totalVotos > 0) {
      const maxVotos = Math.max(...resultados.map((r) => r.votos));
      const ganadores = resultados.filter((r) => r.votos === maxVotos);
      ganador = ganadores.map((g) => g.name).join(", ");
    }

    res.status(200).json({
      encuesta: encuesta.pregunta,
      totalVotos,
      ganador,
      resultados,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al calcular los resultados" });
  }
};




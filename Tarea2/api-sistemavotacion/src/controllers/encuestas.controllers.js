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
        pregunta: pregunta,
        opciones: {
          create: opciones 
        }
      },
      include: { 
        opciones: true 
      }
    });

    res.status(201).json(nuevaEncuesta);
  } catch (error) {
    console.log(error); 
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





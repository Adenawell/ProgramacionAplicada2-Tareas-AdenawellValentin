import {prisma} from "../db.js";

// Obtener todas las encuestas
export const getEncuestas = async (req, res) => {
  try {
    const encuestas = await prisma.encuesta.findMany();
    res.json(encuestas);
  } catch (error) {
    res.status(500).json({error: "Error al obtener las encuestas"});
  } 
}





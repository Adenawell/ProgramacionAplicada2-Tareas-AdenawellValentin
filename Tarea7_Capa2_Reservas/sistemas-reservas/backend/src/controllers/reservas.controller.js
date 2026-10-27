import { prisma } from '../db.js';

export const crearReserva = async (req, res) => {
  try {
    const { servicioId, fecha, hora } = req.body;
    

    const fechaReserva = new Date(`${fecha}T${hora}:00`);
    const ahoraConTolerancia = new Date(Date.now() - 2 * 60 * 1000); 

    if (fechaReserva < ahoraConTolerancia) {
      return res.status(400).json({ error: 'No puedes reservar en una fecha o hora pasada' });
    }

    const reserva = await prisma.reserva.create({
      data: {
        fecha,
        hora,
        usuarioId: req.usuario.id,
        servicioId: Number(servicioId)
      }
    });
    res.status(201).json(reserva);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const obtenerMisReservas = async (req, res) => {
  try {
    const reservas = await prisma.reserva.findMany({
      where: { usuarioId: req.usuario.id },
      include: { servicio: true },
      orderBy: { fecha: 'desc' }
    });
    res.json(reservas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const obtenerTodas = async (req, res) => {
  try {
    const reservas = await prisma.reserva.findMany({
      include: { servicio: true, usuario: { select: { nombre: true, email: true } } },
      orderBy: { fecha: 'desc' }
    });
    res.json(reservas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const cambiarEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body; 
    
    const reserva = await prisma.reserva.update({
      where: { id: Number(id) },
      data: { estado }
    });
    res.json(reserva);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const cancelarReserva = async (req, res) => {
  try {
    const { id } = req.params;
    
    const reservaExistente = await prisma.reserva.findUnique({ where: { id: Number(id) } });
    
    if (!reservaExistente || reservaExistente.usuarioId !== req.usuario.id) {
      return res.status(403).json({ error: 'No puedes cancelar esta reserva' });
    }

    if (reservaExistente.estado !== 'pendiente') {
      return res.status(400).json({ error: 'Solo se pueden cancelar reservas pendientes' });
    }

    const reservaCancelada = await prisma.reserva.update({
      where: { id: Number(id) },
      data: { estado: 'cancelada' }
    });
    res.json({ mensaje: 'Reserva cancelada correctamente', reserva: reservaCancelada });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
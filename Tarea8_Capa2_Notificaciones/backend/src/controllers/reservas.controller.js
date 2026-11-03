import { prisma } from '../db.js';

export const crearReserva = async (req, res) => {
  try {
    const { servicioId, fecha, hora } = req.body;
    const usuarioId = req.usuario.id;
    const servicioIdNum = Number(servicioId);

    // Validar que la fecha sea futura
    const fechaReserva = new Date(`${fecha}T${hora}:00`);
    if (fechaReserva <= new Date()) {
      return res.status(400).json({ error: 'La fecha y hora de la reserva deben ser futuras.' });
    }

    // 2. Validar que el servicio exista y este activo
    const servicio = await prisma.servicio.findUnique({
      where: { id: servicioIdNum }
    });
    if (!servicio || !servicio.activo) {
      return res.status(404).json({ error: 'El servicio no existe o no está activo.' });
    }

    // Validar que el usuario no tenga otra reserva activa para el mismo servicio en la misma fecha
    const reservaDuplicada = await prisma.reserva.findFirst({
      where: {
        usuarioId,
        servicioId: servicioIdNum,
        fecha,
        estado: { not: 'cancelada' }
      }
    });
    if (reservaDuplicada) {
      return res.status(409).json({ error: 'Ya tienes una reserva activa para este servicio en esta fecha.' });
    }

    const reserva = await prisma.reserva.create({
      data: {
        fecha,
        hora,
        usuarioId,
        servicioId: servicioIdNum
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
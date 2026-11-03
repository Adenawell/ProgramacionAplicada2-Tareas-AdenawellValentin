export const actualizarPerfil = async (req, res) => {
  try {
    const { nombre } = req.body;
    if (!nombre) {
      return res.status(400).json({ error: 'El nombre es obligatorio.' });
    }

    const usuarioActualizado = await prisma.usuario.update({
      where: { id: req.usuario.id },
      data: { nombre },
      select: { id: true, nombre: true, email: true, rol: true } 
    });

    res.json(usuarioActualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
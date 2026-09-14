export const validarTurno = (req, res, next) => {
    const { cliente, servicio } = req.body;

    if (!cliente || typeof cliente !== 'string' || cliente.trim() === "") {
        return res.status(400).json({ error: "El cliente es obligatorio y no puede estar vacio" });
    }

    if (!servicio || typeof servicio !== 'string' || servicio.trim() === "") {
        return res.status(400).json({ error: "El servicio es obligatorio y no puede estar vacio" });
    }

    next();
};
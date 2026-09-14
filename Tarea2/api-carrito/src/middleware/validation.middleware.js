export const validarProducto = (req, res, next) => {
    const { nombre, precio, cantidad } = req.body || {};
    
    if (!nombre || precio === undefined || cantidad === undefined) {
        return res.status(400).json({ error: "Nombre, precio y cantidad son obligatorios" });
    }
    if (precio <= 0 || cantidad <= 0) {
        return res.status(400).json({ error: "Precio y cantidad deben ser positivos" });
    }
    next();
};

export const validarCantidad = (req, res, next) => {
    const cantidad = req.body?.cantidad;

    if (cantidad === undefined || cantidad <= 0) {
        return res.status(400).json({ error: "La cantidad debe ser un numero positivo" });
    }
    next();
};

export const validarDescuento = (req, res, next) => {
    const porcentaje = req.body?.porcentaje;

    if (porcentaje === undefined || porcentaje <= 0) {
        return res.status(400).json({ error: "El porcentaje debe ser un numero positivo" });
    }
    if (porcentaje > 50) {
        return res.status(400).json({ error: "El descuento maximo permitido es 50%" });
    }
    next();
};
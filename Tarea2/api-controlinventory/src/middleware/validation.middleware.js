export const validarProducto = (req, res, next) => {
    const { producto, stock } = req.body || {};
    
    if (!producto || stock === undefined || stock < 0) {
        return res.status(400).json({ error: "El nombre del producto y un stock válido son obligatorios" });
    }
    next();
};

export const validarCantidad = (req, res, next) => {
    const { cantidad } = req.body || {};

    if (cantidad === undefined || cantidad <= 0) {
        return res.status(400).json({ error: "La cantidad debe ser un número positivo" });
    }
    next();
};
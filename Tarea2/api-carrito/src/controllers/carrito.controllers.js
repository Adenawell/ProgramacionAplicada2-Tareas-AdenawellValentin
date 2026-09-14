
let productos = [];
let nextId = 1;

// Obtener todos los productos
export const obtenerProductos = (req, res) => {
    res.json(productos);
};


// Crear o actualizar un producto
export const crearProducto = (req, res) => {
    const { nombre, precio, cantidad } = req.body;
    
    const productoExistente = productos.find(p => p.nombre.toLowerCase() === nombre.toLowerCase());

    if (productoExistente) {
        productoExistente.cantidad += cantidad;
        return res.json(productoExistente);
    }

    // Crear nuevo producto
    const producto = { id: nextId++, nombre, precio, cantidad };
    productos.push(producto);
    res.status(201).json(producto);
};

// Actualizar la cantidad de un producto
export const actualizarCantidad = (req, res) => {
    const producto = productos.find(p => p.id === parseInt(req.params.id));
    if (!producto) return res.status(404).json({ error: "Producto no encontrado" });

    producto.cantidad = req.body.cantidad;
    res.json(producto);
};

// Eliminar un producto
export const eliminarProducto = (req, res) => {
    const index = productos.findIndex(p => p.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ error: "Producto no encontrado" });

    productos.splice(index, 1);
    res.json({ mensaje: "Eliminado" });
};

// Obtener el total del carrito
export const obtenerTotalCarrito = (req, res) => {
    let total = 0;
    productos.forEach(p => {
        total += (p.precio * p.cantidad);
    });
    res.json({ total });
};

// Aplicar descuento al carrito
export const aplicarDescuento = (req, res) => {
    const { porcentaje } = req.body;
    
    if (porcentaje === undefined || porcentaje < 0 || porcentaje > 50) {
        return res.status(400).json({ error: "El descuento debe ser entre 0 y 50" });
    }

    let totalOriginal = 0;
    productos.forEach(p => {
        totalOriginal += (p.precio * p.cantidad);
    });

    const totalConDescuento = totalOriginal - (totalOriginal * (porcentaje / 100));

    res.json({ 
        totalOriginal, 
        porcentajeAplicado: porcentaje, 
        totalConDescuento 
    });
};
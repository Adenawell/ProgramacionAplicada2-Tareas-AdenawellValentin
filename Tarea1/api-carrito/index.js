const express = require('express');
const app = express();

app.use(express.json());

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

const validarProducto = (req, res, next) => {
    const { nombre, precio, cantidad } = req.body;
    
    if (!nombre || precio === undefined || cantidad === undefined) {
        return res.status(400).json({ error: "Nombre, precio y cantidad son obligatorios" });
    }
    if (precio <= 0 || cantidad <= 0) {
        return res.status(400).json({ error: "Precio y cantidad deben ser positivos" });
    }
    next();
};

const validarCantidad = (req, res, next) => {
    if (req.body.cantidad === undefined || req.body.cantidad <= 0) {
        return res.status(400).json({ error: "La cantidad debe ser un numero positivo" });
    }
    next();
};

let productos = [];
let nextId = 1;

app.get('/productos', (req, res) => {
    res.json(productos);
});

app.post('/productos', validarProducto, (req, res) => {
    const { nombre, precio, cantidad } = req.body;
    const productoExistente = productos.find(p => p.nombre.toLowerCase() === nombre.toLowerCase());

    if (productoExistente) {
        productoExistente.cantidad += cantidad;
        return res.json(productoExistente);
    }

    const producto = { id: nextId++, nombre, precio, cantidad };
    productos.push(producto);
    res.status(201).json(producto);
});

app.put('/productos/:id', validarCantidad, (req, res) => {
    const producto = productos.find(p => p.id === parseInt(req.params.id));
    if (!producto) return res.status(404).json({ error: "Producto no encontrado" });

    producto.cantidad = req.body.cantidad;
    res.json(producto);
});

app.delete('/productos/:id', (req, res) => {
    const index = productos.findIndex(p => p.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ error: "Producto no encontrado" });

    productos.splice(index, 1);
    res.json({ mensaje: "Eliminado" });
});

app.get('/carrito/total', (req, res) => {
    const total = productos.reduce((acc, p) => acc + (p.precio * p.cantidad), 0);
    res.json({ total });
});

app.post('/carrito/aplicar-descuento', (req, res) => {
    const { porcentaje } = req.body;
    
    if (porcentaje === undefined || porcentaje < 0 || porcentaje > 50) {
        return res.status(400).json({ error: "El descuento debe ser entre 0 y 50" });
    }

    const totalOriginal = productos.reduce((acc, p) => acc + (p.precio * p.cantidad), 0);
    const totalConDescuento = totalOriginal - (totalOriginal * (porcentaje / 100));

    res.json({ 
        totalOriginal, 
        porcentajeAplicado: porcentaje, 
        totalConDescuento 
    });
});

app.listen(3000, () => console.log("Servidor en el puerto 3000"));
const express = require('express');
const app = express();

app.use(express.json());

app.use((req, res, next) => {
    console.log(`[LOG] ${req.method} ${req.url}`);
    next();
});

let inventario = [];
let generadorId = 1;

// Crear producto
app.post('/inventario', (req, res) => {
    const { producto, stock, stockMinimo } = req.body;

    if (!producto || stock === undefined) {
        return res.status(400).json({ error: "Mi bro eres idiota faltan datos" });
    }

    let minimo = 5;
    if (stockMinimo !== undefined) {
        minimo = stockMinimo;
    }

    const nuevo = {
        id: generadorId++,
        producto: producto,
        stock: stock,
        stockMinimo: minimo
    };

    inventario.push(nuevo);
    res.status(201).json(nuevo);
});

// Listar todo
app.get('/inventario', (req, res) => {
    res.json(inventario);
});


app.get('/inventario/alertas', (req, res) => {
    let alertas = [];

    for (let i = 0; i < inventario.length; i++) {
        let item = inventario[i];
        
        if (item.stock < item.stockMinimo) {
            let falta = item.stockMinimo - item.stock;
            alertas.push({
                producto: item.producto,
                stockActual: item.stock,
                minimoRequerido: item.stockMinimo,
                cuantoFalta: falta
            });
        }
    }

    res.json(alertas);
});

//Entrada de stock
app.post('/inventario/:id/entrada', (req, res) => {
    const id = parseInt(req.params.id);
    const { cantidad } = req.body;

    if (!cantidad || cantidad <= 0) {
        return res.status(400).json({ error: "Cantidad invalida animal no valido" });
    }

    const item = inventario.find(p => p.id === id);
    if (!item) {
        return res.status(404).json({ error: "No existe" });
    }

    item.stock += cantidad;
    res.json({ mensaje: "Entrada lista", producto: item });
});

// Salida de stock
app.post('/inventario/:id/salida', (req, res) => {
    const id = parseInt(req.params.id);
    const { cantidad } = req.body;

    if (!cantidad || cantidad <= 0) {
        return res.status(400).json({ error: "Cantidad invalida animal no valido" });
    }

    const item = inventario.find(p => p.id === id);
    if (!item) {
        return res.status(404).json({ error: "No existe" });
    }

    if (cantidad > item.stock) {
        return res.status(400).json({ error: "No hay stock suficiente" });
    }

    item.stock -= cantidad;
    res.json({ mensaje: "Salida completada", producto: item });
});

app.listen(3000, () => {
    console.log("Servidor de inventario en el puerto 3000");
});
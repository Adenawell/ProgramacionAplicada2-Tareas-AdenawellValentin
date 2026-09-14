import { db } from "../db.js";

// Listar todo el inventario
export const listarInventario = async (req, res) => {
    try {
        const inventario = await db.inventario.findMany();
        res.json(inventario);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el inventario" });
    }
};

// Crear producto con stockMinimo por defecto en 5 si no se envia
export const crearProducto = async (req, res) => {
    try {
        const { producto, stock, stockMinimo } = req.body;

        const nuevoProducto = await db.inventario.create({
            data: {
                producto,
                stock,
                stockMinimo: stockMinimo !== undefined ? stockMinimo : 5
            }
        });

        res.status(201).json(nuevoProducto);
    } catch (error) {
        res.status(500).json({ error: "Error al crear el producto" });
    }
};

// Registrar entrada de stock
export const entradaStock = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { cantidad } = req.body;

        const item = await db.inventario.findUnique({ where: { id } });
        if (!item) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        const productoActualizado = await db.inventario.update({
            where: { id },
            data: { stock: item.stock + cantidad }
        });

        res.json({ mensaje: "Entrada registrada exitosamente", producto: productoActualizado });
    } catch (error) {
        res.status(500).json({ error: "Error al registrar la entrada" });
    }
};

// Registrar salida de stock (valida que cantidad <= stock disponible)
export const salidaStock = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { cantidad } = req.body;

        const item = await db.inventario.findUnique({ where: { id } });
        if (!item) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        if (cantidad > item.stock) {
            return res.status(400).json({ error: "No hay stock suficiente para realizar la salida" });
        }

        const productoActualizado = await db.inventario.update({
            where: { id },
            data: { stock: item.stock - cantidad }
        });

        res.json({ mensaje: "Salida registrada exitosamente", producto: productoActualizado });
    } catch (error) {
        res.status(500).json({ error: "Error al registrar la salida" });
    }
};

// Obtener alertas de productos bajo el stock minimo
export const obtenerAlertas = async (req, res) => {
    try {
        const productos = await db.inventario.findMany();
        let alertas = [];

        for (let item of productos) {
            if (item.stock < item.stockMinimo) {
                let falta = item.stockMinimo - item.stock;
                alertas.push({
                    id: item.id,
                    producto: item.producto,
                    stockActual: item.stock,
                    minimoRequerido: item.stockMinimo,
                    cuantoFalta: falta
                });
            }
        }

        res.json(alertas);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener las alertas de inventario" });
    }
};
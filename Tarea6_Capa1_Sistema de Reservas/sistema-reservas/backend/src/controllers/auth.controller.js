import { prisma } from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const registro = async (req, res, next) => {
    try {
        const { nombre, email, password, rol } = req.body;

        const usuarioExistente = await prisma.usuario.findUnique({ 
            where: { email } 
        });

        if (usuarioExistente) {
            return res.status(400).json({ error: "El email ya esta en uso" });
        }


        const passwordHasheada = await bcrypt.hash(password, 10);

        const nuevoUsuario = await prisma.usuario.create({
            data: { 
                nombre, 
                email, 
                password: passwordHasheada, 
                rol: rol || "cliente" 
            }
        });

        const token = jwt.sign(
            { 
                id: nuevoUsuario.id, 
                nombre: nuevoUsuario.nombre, 
                email: nuevoUsuario.email, 
                rol: nuevoUsuario.rol 
            },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        return res.status(201).json({ 
            mensaje: "Usuario creado con exito",
            token,
            rol: nuevoUsuario.rol
        });

    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const usuario = await prisma.usuario.findUnique({ 
            where: { email } 
        });

        if (!usuario) {
            return res.status(401).json({ error: "Credenciales invalidas" });
        }

        const passwordValida = await bcrypt.compare(password, usuario.password);

        if (!passwordValida) {
            return res.status(401).json({ error: "Credenciales invalidas" });
        }

        const token = jwt.sign(
            { 
                id: usuario.id, 
                nombre: usuario.nombre, 
                email: usuario.email, 
                rol: usuario.rol 
            },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        return res.json({ 
            mensaje: "Inicio de sesion exitoso",
            token,
            rol: usuario.rol
        });

    } catch (error) {
        next(error);
    }
};
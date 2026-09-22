import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { prisma } from "../db.js";

export const registro = async (req, res, next) => {
  try {
    const { nombre, email, password, rol } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ error: "faltan campos obligatorios" });
    }

    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email }
    });

    if (usuarioExistente) {
      return res.status(400).json({ error: "el email ya esta registrado" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const usuario = await prisma.usuario.create({
      data: {
        nombre,
        email,
        password: passwordHash,
        rol: rol || "CLIENT"
      }
    });

    const { password: _, ...usuarioSinPassword } = usuario;
    return res.status(201).json(usuarioSinPassword);

  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "email y password requeridos" });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { email }
    });

    if (!usuario) {
      return res.status(401).json({ error: "credenciales invalidas" });
    }

    const passwordValido = await bcrypt.compare(password, usuario.password);

    if (!passwordValido) {
      return res.status(401).json({ error: "credenciales invalidas" });
    }

    const secret = process.env.JWT_SECRET || "clave_secreta_jwt";
    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      secret,
      { expiresIn: "1h" }
    );

    return res.status(200).json({ token });

  } catch (error) {
    next(error);
  }
};
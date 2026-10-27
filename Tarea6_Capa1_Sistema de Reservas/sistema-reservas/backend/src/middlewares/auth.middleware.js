import "dotenv/config";
import jwt from "jsonwebtoken";

export const validarToken = (req, res, next) => {
    const header = req.headers["authorization"];
    
    if (!header) {
        return res.status(401).json({ error: "Token requerido" });
    }
    
    const token = header.split(" ")[1];
    
    if (!token) {
        return res.status(401).json({ error: "Formato de token invalido" });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Token invalido o expirado" });
    }
};

export const soloAdmin = (req, res, next) => {
    if (!req.usuario || req.usuario.rol !== "admin") {
        return res.status(403).json({ error: "Acceso denegado. Se requiere rol de admin" });
    }
    
    next();
};
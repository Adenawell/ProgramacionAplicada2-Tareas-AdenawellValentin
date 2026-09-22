import "dotenv/config"
import express from "express";
import v1TareasRoutes from "./routes/v1/tareas.routes.js";
import v2TareasRoutes from "./routes/v2/tareas.routes.js";
import authRoutes from "./routes/auth.routes.js";
import { apikeyMiddleware } from "./middlewares/apikey.middleware.js";
import { verificarToken } from "./middlewares/authmiddleware.js";

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.use("/auth", authRoutes);
app.use("/v1/tareas", apikeyMiddleware, v1TareasRoutes);
app.use("/v2/tareas", verificarToken, v2TareasRoutes);

const errorHandler = (err, req, res, next) => {
    console.error(err.message);
    res.status(500).json({ error: "Error interno del servidor" });
}

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
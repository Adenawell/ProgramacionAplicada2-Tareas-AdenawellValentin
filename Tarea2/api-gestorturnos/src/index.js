import "dotenv/config";
import express from "express";
import turnoRouter from "./routes/turno.routes.js";

const app = express();
app.use(express.json());
app.use("/turnos", turnoRouter);

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
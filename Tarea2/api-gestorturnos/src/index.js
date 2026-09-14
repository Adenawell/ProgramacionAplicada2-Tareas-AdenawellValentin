import "dotenv/config";
import express from "express";
import turnoRouter from "./routes/turno.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/turnos", turnoRouter);

app.listen(PORT, () => {
  console.log(`Servidor en el puerto ${PORT}`);
});
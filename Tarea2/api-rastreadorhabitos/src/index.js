import "dotenv/config";
import express from "express";
import habitosRouter from "./routes/habitos.routes.js";

const app = express();
app.use(express.json());
app.use("/habitos", habitosRouter);

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
import "dotenv/config";
import express from "express";
import encuestasRouter from "./routes/encuestas.js";

const app = express();
app.use(express.json());
app.use("/encuestas", encuestasRouter);


// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});




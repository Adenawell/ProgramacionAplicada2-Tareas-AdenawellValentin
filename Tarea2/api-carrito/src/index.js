import "dotenv/config";
import express from "express";
import carritoRouter from "./routes/carrito.routes.js";

const app = express();
app.use(express.json());

app.use("/", carritoRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
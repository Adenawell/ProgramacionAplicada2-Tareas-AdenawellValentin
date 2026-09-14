import "dotenv/config";
import express from "express";
import controlInventoryRouter from "./routes/controlinventory.routes.js";

const app = express();
app.use(express.json());

app.use("/inventario", controlInventoryRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
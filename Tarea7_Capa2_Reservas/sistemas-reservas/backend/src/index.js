import express from 'express'
import { loggerMiddleware } from './middlewares/logger.middleware.js';
import authRoutes from './routes/auth.routes.js'
import servicesRoutes from './routes/servicios.routes.js'
import { validarToken } from './middlewares/auth.middleware.js';
const app = express();
app.use(express.json());
app.use(loggerMiddleware);
const PORT = process.env.PORT || 3000;

app.use("/auth", authRoutes);
app.use("/servicios", validarToken, servicesRoutes);
app.use('/reservas', reservas);

app.use((error, req, res, next)=>{
    console.error("Error en el Servidor", error.message);
    return res.status(500).json({error: "Error en el Servidor"});
})


app.listen(PORT, ()=> {console.log( `Servidor Corriendo en puerto ${PORT}`)});
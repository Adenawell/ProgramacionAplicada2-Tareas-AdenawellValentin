const express = require('express');
const app = express();

app.use(express.json());

app.use((req, res, next) => {
    console.log(`[LOG] ${req.method} ${req.url}`);
    next();
});

let habitos = [];
let idHabito = 1;

// Crear habito
app.post('/habitos', (req, res) => {
    const { nombre, meta } = req.body;

    if (!nombre || !meta) {
        return res.status(400).json({ error: "Faltan datos" });
    }

    // Guardar fecha de creacion para calcular el porcentaje luego
    const fechaDeHoy = new Date().toISOString().split('T')[0];

    const nuevo = {
        id: idHabito++,
        nombre: nombre,
        meta: meta,
        fechaCreacion: fechaDeHoy,
        registros: []
    };

    habitos.push(nuevo);
    res.status(201).json(nuevo);
});

// Listar habitos
app.get('/habitos', (req, res) => {
    res.json(habitos);
});

// Registrar el habito del dia
app.post('/habitos/:id/registrar', (req, res) => {
    const id = parseInt(req.params.id);
    const habito = habitos.find(h => h.id === id);

    if (!habito) {
        return res.status(404).json({ error: "No existe" });
    }

    // Regla: La fecha la pone el servidor
    const hoy = new Date().toISOString().split('T')[0];

    // Regla: No se puede registrar dos veces el mismo dia
    let yaRegistrado = false;
    for (let i = 0; i < habito.registros.length; i++) {
        if (habito.registros[i].fecha === hoy) {
            yaRegistrado = true;
        }
    }

    if (yaRegistrado) {
        return res.status(400).json({ error: "Ya registraste esto hoy" });
    }

    habito.registros.push({ fecha: hoy, completado: true });
    res.json({ mensaje: "Registro guardado", habito: habito });
});

// Estadisticas
app.get('/habitos/:id/estadisticas', (req, res) => {
    const id = parseInt(req.params.id);
    const habito = habitos.find(h => h.id === id);

    if (!habito) {
        return res.status(404).json({ error: "No existe" });
    }

    let rachaActual = 0;
    let mejorRacha = 0;
    let rachaTemporal = 0;

    if (habito.registros.length > 0) {
        rachaTemporal = 1;
        mejorRacha = 1;

        // Calcular la mejor racha revisando los dias de diferencia
        for (let i = 1; i < habito.registros.length; i++) {
            let fechaAnterior = new Date(habito.registros[i - 1].fecha).getTime();
            let fechaActual = new Date(habito.registros[i].fecha).getTime();
            
            // Convertir la diferencia de milisegundos a dias
            let diferenciaDias = (fechaActual - fechaAnterior) / (1000 * 60 * 60 * 24);

            if (diferenciaDias === 1) {
                rachaTemporal++;
            } else {
                rachaTemporal = 1; // Se rompio la racha
            }

            if (rachaTemporal > mejorRacha) {
                mejorRacha = rachaTemporal;
            }
        }

        // Calcular si la racha actual sigue viva hoy
        let ultimoRegistro = new Date(habito.registros[habito.registros.length - 1].fecha).getTime();
        let diaDeHoy = new Date(new Date().toISOString().split('T')[0]).getTime();
        let difHoy = (diaDeHoy - ultimoRegistro) / (1000 * 60 * 60 * 24);

        if (difHoy <= 1) {
            rachaActual = rachaTemporal;
        } else {
            rachaActual = 0;
        }
    }

    // Calcular porcentaje de cumplimiento
    let diaDeHoy = new Date(new Date().toISOString().split('T')[0]).getTime();
    let diaCreado = new Date(habito.fechaCreacion).getTime();
    let diasTotales = ((diaDeHoy - diaCreado) / (1000 * 60 * 60 * 24)) + 1;
    let diasCumplidos = habito.registros.length;

    let porcentaje = 0;
    if (diasTotales > 0) {
        porcentaje = (diasCumplidos / diasTotales) * 100;
    }

    res.json({
        nombre: habito.nombre,
        rachaActual: rachaActual,
        mejorRacha: mejorRacha,
        porcentaje: porcentaje.toFixed(2) + "%"
    });
});

// Eliminar habito
app.delete('/habitos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const posicion = habitos.findIndex(h => h.id === id);

    if (posicion === -1) {
        return res.status(404).json({ error: "No existe" });
    }

    habitos.splice(posicion, 1);
    res.json({ mensaje: "Borrado" });
});

app.listen(3000, () => {
    console.log("Servidor de habitos en el puerto 3000");
});
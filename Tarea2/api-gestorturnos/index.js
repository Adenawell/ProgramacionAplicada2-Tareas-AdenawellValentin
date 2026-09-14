const express = require('express');
const app = express();

app.use(express.json());

app.use((req, res, next) => {
    console.log(`[LOG] ${req.method} ${req.url}`);
    next();
});

let listaTurnos = [];
let idTurno = 1;

// Crear turno para entrar a la cola 
app.post('/turnos', (req, res) => {
    const { cliente, servicio } = req.body;

    if (!cliente || !servicio) {
        return res.status(400).json({ error: "Faltan datos" });
    }

    const nuevo = {
        id: idTurno++,
        cliente: cliente,
        servicio: servicio,
        estado: "esperando"
    };

    listaTurnos.push(nuevo);
    res.status(201).json(nuevo);
});

// Ver todos los turnos
app.get('/turnos', (req, res) => {
    res.json(listaTurnos);
});

// Ver quien es el proximo (osea el primero de la cola que esta esperando)

app.get('/turnos/siguiente', (req, res) => {
    const siguiente = listaTurnos.find(t => t.estado === "esperando");
    
    if (!siguiente) {
        return res.status(404).json({ error: "No hay nadie en cola" });
    }
    
    res.json(siguiente);
});

// ver cuantos estan esperando
app.get('/turnos/espera', (req, res) => {
    let contador = 0;
    for (let i = 0; i < listaTurnos.length; i++) {
        if (listaTurnos[i].estado === "esperando") {
            contador++;
        }
    }
    res.json({ esperando: contador });
});

// Llamar al siguiente
app.put('/turnos/llamar', (req, res) => {
    // no se puede llamar a otro si ya hay uno en estado atendiendo
    const ocupado = listaTurnos.find(t => t.estado === "atendiendo");
    if (ocupado) {
        return res.status(400).json({ error: "Ya hay un turno en atencion" });
    }

    // Buscar el primer turno que este esperando
    const proximo = listaTurnos.find(t => t.estado === "esperando");
    if (!proximo) {
        return res.status(404).json({ error: "Cola vacia" });
    }

    proximo.estado = "atendiendo";
    res.json({ mensaje: "Turno llamado", turno: proximo });
});

// Finalizar un turno
app.put('/turnos/:id/finalizar', (req, res) => {
    const id = parseInt(req.params.id);
    const turno = listaTurnos.find(t => t.id === id);

    if (!turno) {
        return res.status(404).json({ error: "No existe" });
    }

    if (turno.estado !== "atendiendo") {
        return res.status(400).json({ error: "Solo puedes finalizar turnos en atencion" });
    }

    turno.estado = "finalizado";
    res.json({ mensaje: "Turno terminado", turno: turno });
});

app.listen(3000, () => {
    console.log("Servidor de turnos en el puerto 3000");
});
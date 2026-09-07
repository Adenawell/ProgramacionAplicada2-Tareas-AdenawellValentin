const express = require('express');
const app = express();

app.use(express.json());

app.use((req, res, next) => {
    console.log(`[LOG] ${req.method} ${req.url} - ${new Date().toLocaleTimeString()}`);
    next();
});

const chequearEncuesta = (req, res, next) => {
    const { pregunta, opciones } = req.body;
    
    if (!pregunta || !opciones || !Array.isArray(opciones)) {
        return res.status(400).json({ error: "Faltan datos" });
    }
    if (opciones.length < 2) {
        return res.status(400).json({ error: "Minimo 2 opciones" });
    }
    next();
};

const chequearVoto = (req, res, next) => {
    if (!req.body.opcion) {
        return res.status(400).json({ error: "Falta la opcion" });
    }
    next();
};

let listaEncuestas = [];
let idEncuesta = 1;

app.post('/encuestas', chequearEncuesta, (req, res) => {
    const { pregunta, opciones } = req.body;
    
    let arregloOpciones = [];
    for (let i = 0; i < opciones.length; i++) {
        arregloOpciones.push({
            nombre: opciones[i],
            votos: 0
        });
    }

    const nueva = {
        id: idEncuesta++,
        pregunta: pregunta,
        opciones: arregloOpciones
    };

    listaEncuestas.push(nueva);
    res.status(201).json(nueva);
});

app.get('/encuestas', (req, res) => {
    res.json(listaEncuestas);
});

app.post('/encuestas/:id/votar', chequearVoto, (req, res) => {
    const id = parseInt(req.params.id);
    const encuesta = listaEncuestas.find(e => e.id === id);

    if (!encuesta) {
        return res.status(404).json({ error: "No existe" });
    }

    const opcionElegida = req.body.opcion;
    const existeOpcion = encuesta.opciones.find(o => o.nombre === opcionElegida);

    if (!existeOpcion) {
        return res.status(400).json({ error: "Opcion invalida" });
    }

    existeOpcion.votos += 1;
    res.json({ 
        mensaje: "Voto guardado", 
        encuesta: encuesta 
    });
});

app.get('/encuestas/:id/resultados', (req, res) => {
    const id = parseInt(req.params.id);
    const encuesta = listaEncuestas.find(e => e.id === id);

    if (!encuesta) {
        return res.status(404).json({ error: "No existe" });
    }

    let sumaVotos = 0;
    encuesta.opciones.forEach(o => {
        sumaVotos += o.votos;
    });

    let quienGana = "Nadie";
    let maximoVotos = 0;

    let resultados = [];

    encuesta.opciones.forEach(o => {
        let porciento = 0;
        if (sumaVotos > 0) {
            porciento = ((o.votos / sumaVotos) * 100).toFixed(2);
        }

        if (o.votos > maximoVotos) {
            maximoVotos = o.votos;
            quienGana = o.nombre;
        }

        resultados.push({
            opcion: o.nombre,
            votosTotales: o.votos,
            porcentaje: `${porciento}%`
        });
    });

    res.json({
        pregunta: encuesta.pregunta,
        totalVotos: sumaVotos,
        ganando: quienGana,
        detalle: resultados
    });
});

app.delete('/encuestas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const pos = listaEncuestas.findIndex(e => e.id === id);

    if (pos === -1) {
        return res.status(404).json({ error: "No existe" });
    }

    listaEncuestas.splice(pos, 1);
    res.json({ mensaje: "Borrada" });
});

app.listen(3000, () => {
    console.log("Servidor en el puerto 3000");
});
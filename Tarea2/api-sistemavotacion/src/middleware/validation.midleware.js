export const validarEncuesta = (req, res, next) => {
  const { pregunta, opciones } = req.body;

  if (!pregunta || typeof pregunta !== 'string' || pregunta.trim() === "") {
    return res.status(400).json({ error: "La pregunta es obligatoria y no puede estar vacia" });
  }

  if (!opciones || !Array.isArray(opciones) || opciones.length < 2) {
    return res.status(400).json({ error: "Debe proporcionar un conjunto con al menos dos opciones" });
  }

  const tieneOpcionesInvalidas = opciones.some(
    (opcion) => !opcion.name || typeof opcion.name !== 'string' || opcion.name.trim() === ""
  );

  if (tieneOpcionesInvalidas) {
    return res.status(400).json({ error: "Cada opcion debe contener un texto valido y no vacio" });
  }

  next();
};
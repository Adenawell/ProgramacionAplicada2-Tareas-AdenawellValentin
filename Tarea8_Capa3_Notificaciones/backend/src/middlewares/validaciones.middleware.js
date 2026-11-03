

export const validarRegistro = (req, res, next) => {
    if (!req.body.nombre || req.body.nombre.trim() === "")
        return res.status(400).json({ error: "Nombre es un campo requerido" });
    if (!req.body.email || req.body.email.trim() === "")
        return res.status(400).json({ error: "Email es un campo requerido" });
    if (!req.body.password || req.body.password.trim() === "")
        return res.status(400).json({ error: "Contrasena es un campo requerido" });
    if (typeof req.body.nombre !== "string")
        return res.status(400).json({ error: "Nombre debe ser una cadena de texto" });
    if (!req.body.email.includes("@gmail.com"))
        return res.status(400).json({ error: "Email posee formato incorrecto" });
    if (req.body.nombre.length >= 10)
        return res.status(400).json({ error: "Nombre muy largo, Max. 10 caracteres" });
    if (req.body.nombre.length < 3)
        return res.status(400).json({ error: "Nombre muy corto, Min. 3 caracteres" });
    if (req.body.password.length < 7)
        return res.status(400).json({ error: "Contrasena muy corta, Min. 7 caracteres" });
    if (req.body.password.length > 20)
        return res.status(400).json({ error: "Contrasena muy larga, Max. 20 caracteres" });
    
    next();
};

export const validarLogin = (req, res, next) => {
    if (!req.body.email || req.body.email.trim() === "")
        return res.status(400).json({ error: "Email es un campo requerido" });
    if (!req.body.password || req.body.password.trim() === "")
        return res.status(400).json({ error: "Contrasena es un campo requerido" });
    if (!req.body.email.includes("@gmail.com"))
        return res.status(400).json({ error: "Email posee formato incorrecto" });
    
    next();
};

export const validarCreacionYEdicionServicio = (req, res, next) => {
    if (!req.body.nombre || req.body.nombre.trim() === "")
        return res.status(400).json({ error: "Nombre es un campo requerido" });
    if (!req.body.descripcion || req.body.descripcion.trim() === "")
        return res.status(400).json({ error: "Descripcion es un campo requerido" });
    if (!req.body.duracion)
        return res.status(400).json({ error: "Duracion es un campo requerido" });
    if (!req.body.precio)
        return res.status(400).json({ error: "Precio es un campo requerido" });
    if (typeof req.body.nombre !== "string")
        return res.status(400).json({ error: "Nombre debe ser una cadena de texto" });
    if (typeof req.body.descripcion !== "string")
        return res.status(400).json({ error: "Descripcion debe ser una cadena de texto" });
    if (typeof req.body.duracion !== "number" || req.body.duracion < 1)
        return res.status(400).json({ error: "Duracion debe ser un numero positivo" });
    if (typeof req.body.precio !== "number" || req.body.precio < 1)
        return res.status(400).json({ error: "Precio debe ser un numero positivo" });
    
    next();
};

export const validarId = (req, res, next) => {
    if (parseInt(req.params.id) < 1 || isNaN(parseInt(req.params.id)))
        return res.status(400).json({ error: "Id debe ser parametro numerico entero positivo" });
    
    next();
};
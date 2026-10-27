const esAdmin = (req, res, next) => {
  if (req.usuario.rol !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado. Se necesita rol de administrador.' });
  }
  next();
};

module.exports = esAdmin;
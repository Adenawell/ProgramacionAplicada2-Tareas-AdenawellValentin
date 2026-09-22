import jwt from 'jsonwebtoken'

export const verificarToken = (req, res, next) => {
  try {
    const header = req.headers['authorization']
    if (!header) {
      return res.status(401).json({ error: 'token no proporcionado' })
    }

    const token = header.split(' ')[1]
    if (!token) {
      return res.status(401).json({ error: 'token no proporcionado' })
    }

    const secret = process.env.JWT_SECRET || 'clave_secreta_jwt'
    const decoded = jwt.verify(token, secret)
    req.usuario = decoded
    next()
  } catch (error) {
    return res.status(403).json({ error: 'token invalido o expirado' })
  }
}

export const soloAdmin = (req, res, next) => {
  try {
    if (!req.usuario || req.usuario.rol !== 'admin') {
      return res.status(403).json({ error: 'acceso denegado' })
    }
    next()
  } catch (error) {
    next(error)
  }
}
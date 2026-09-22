import express from 'express'
import authRoutes from './routes/auth.routes.js'
import tareasV1Routes from './routes/v1/tareas.routes.js'
import tareasV2Routes from './routes/v2/tareas.routes.js'

const app = express()

app.use(express.json())

app.use('/auth', authRoutes)
app.use('/v1/tareas', tareasV1Routes)
app.use('/v2/tareas', tareasV2Routes)

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' })
})

// al final de src/app.js, antes de export default app
app.use((err, req, res, next) => {
  console.error("ERROR INTERNO:", err)
  res.status(500).json({ error: err.message })
})

export default app
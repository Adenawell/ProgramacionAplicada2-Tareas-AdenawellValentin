import request from 'supertest'
import jwt from 'jsonwebtoken'
import app from '../src/app.js'
import { prisma } from '../src/db.js'

describe('Rutas de tareas v2 — /v2/tareas', () => {
  const secret = process.env.JWT_SECRET || 'clave_secreta_jwt'
  let user1, user2, admin
  let tokenUser1, tokenUser2, tokenAdmin
  let tareaId

  beforeAll(async () => {
    user1 = await prisma.usuario.create({
      data: { nombre: 'User 1', email: 'user1.v2.simple@gmail.com', password: '123', rol: 'user' }
    })
    user2 = await prisma.usuario.create({
      data: { nombre: 'User 2', email: 'user2.v2.simple@gmail.com', password: '123', rol: 'user' }
    })
    admin = await prisma.usuario.create({
      data: { nombre: 'Admin', email: 'admin.v2.simple@gmail.com', password: '123', rol: 'admin' }
    })

    tokenUser1 = jwt.sign({ id: user1.id, rol: user1.rol }, secret, { expiresIn: '1h' })
    tokenUser2 = jwt.sign({ id: user2.id, rol: user2.rol }, secret, { expiresIn: '1h' })
    tokenAdmin = jwt.sign({ id: admin.id, rol: admin.rol }, secret, { expiresIn: '1h' })
  })

  afterAll(async () => {
    await prisma.tarea.deleteMany({
      where: { usuarioId: { in: [user1.id, user2.id, admin.id] } }
    })
    await prisma.usuario.deleteMany({
      where: { id: { in: [user1.id, user2.id, admin.id] } }
    })
    await prisma.$disconnect()
  })

  it('POST /v2/tareas: debe crear una tarea', async () => {
    const res = await request(app)
      .post('/v2/tareas')
      .set('Authorization', `Bearer ${tokenUser1}`)
      .send({ titulo: 'Nueva tarea v2' })

    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('id')
    expect(res.body.usuarioId).toBe(user1.id)
    tareaId = res.body.id
  })

  it('GET /v2/tareas: debe listar las tareas', async () => {
    const res = await request(app)
      .get('/v2/tareas')
      .set('Authorization', `Bearer ${tokenUser1}`)

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('PUT /v2/tareas/:id: 403 si intenta editar otro usuario', async () => {
    const res = await request(app)
      .put(`/v2/tareas/${tareaId}`)
      .set('Authorization', `Bearer ${tokenUser2}`)
      .send({ titulo: 'Intento edicion' })

    expect(res.status).toBe(403)
    expect(res.body).toHaveProperty('error')
  })

  it('PUT /v2/tareas/:id: 200 al editar su propia tarea', async () => {
    const res = await request(app)
      .put(`/v2/tareas/${tareaId}`)
      .set('Authorization', `Bearer ${tokenUser1}`)
      .send({ titulo: 'Tarea modificada', completada: true })

    expect(res.status).toBe(200)
    expect(res.body.titulo).toBe('Tarea modificada')
  })

  it('DELETE /v2/tareas/:id: 403 si intenta borrar otro usuario', async () => {
    const res = await request(app)
      .delete(`/v2/tareas/${tareaId}`)
      .set('Authorization', `Bearer ${tokenUser2}`)

    expect(res.status).toBe(403)
    expect(res.body).toHaveProperty('error')
  })

  it('DELETE /v2/tareas/:id: 200 admin puede eliminar', async () => {
    const res = await request(app)
      .delete(`/v2/tareas/${tareaId}`)
      .set('Authorization', `Bearer ${tokenAdmin}`)

    expect(res.status).toBe(200)
  })

  it('DELETE /v2/tareas/:id: 404 si ya no existe', async () => {
    const res = await request(app)
      .delete(`/v2/tareas/${tareaId}`)
      .set('Authorization', `Bearer ${tokenAdmin}`)

    expect(res.status).toBe(404)
    expect(res.body).toHaveProperty('error')
  })
})
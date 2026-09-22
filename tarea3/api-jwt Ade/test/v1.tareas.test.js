import request from 'supertest'
import app from '../src/app.js'
import { prisma } from '../src/db.js'

describe('Rutas de tareas v1 — /v1/tareas', () => {
  let usuarioTest

  beforeAll(async () => {
    usuarioTest = await prisma.usuario.create({
      data: {
        nombre: 'Usuario Tareas',
        email: 'tareas.user.test@gmail.com',
        password: 'password123',
        rol: 'CLIENT'
      }
    })
  })

  afterAll(async () => {
    await prisma.tarea.deleteMany({
      where: { usuarioId: usuarioTest.id }
    })
    await prisma.usuario.delete({
      where: { id: usuarioTest.id }
    })
    await prisma.$disconnect()
  })

  it('debe crear una nueva tarea exitosamente', async () => {
    const res = await request(app)
      .post('/v1/tareas')
      .send({
        titulo: 'Aprender testing con Supertest',
        usuarioId: usuarioTest.id
      })

    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('id')
    expect(res.body.titulo).toBe('Aprender testing con Supertest')
    expect(res.body.usuarioId).toBe(usuarioTest.id)
  })

  it('debe listar todas las tareas registradas', async () => {
    const res = await request(app)
      .get('/v1/tareas')

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBeGreaterThan(0)
    expect(res.body[0]).toHaveProperty('id')
    expect(res.body[0]).toHaveProperty('titulo')
  })
})
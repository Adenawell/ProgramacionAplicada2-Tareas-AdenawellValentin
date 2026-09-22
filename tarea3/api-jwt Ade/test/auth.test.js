import request from 'supertest'
import app from '../src/app.js'

describe('Rutas de autenticacion — /auth', () => {


  // POST /auth/registro

  describe('POST /auth/registro', () => {

    const usuarioValido = {
      nombre: 'Juan Perez',
      email: 'juan.perez.dev@gmail.com',
      password: 'Password123!',
      rol: 'CLIENT'
    };

    it('Registro exitoso: debe retornar 201 y los datos del usuario', async () => {
      const res = await request(app)
        .post('/auth/registro')
        .send(usuarioValido);

      // debe crear el registro y no devolver el password
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.email).toBe(usuarioValido.email);
      expect(res.body.nombre).toBe(usuarioValido.nombre);
      expect(res.body).not.toHaveProperty('password');
    });

    it('Email duplicado: debe retornar 400 si el email ya existe en la DB', async () => {

      const res = await request(app)
        .post('/auth/registro')
        .send(usuarioValido);

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('Sin email: debe retornar 400 si falta el campo email', async () => {

      // body sin email
      const res = await request(app)
        .post('/auth/registro')
        .send({
          nombre: 'Juan Perez',
          password: 'Password123!',
          rol: 'CLIENT'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('Sin password: debe retornar 400 si falta el campo password', async () => {

      // body sin la clave requerida
      const res = await request(app)
        .post('/auth/registro')
        .send({
          nombre: 'Juan Perez',
          email: 'sinpassword.test@gmail.com',
          rol: 'CLIENT'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });


  // POST /auth/login

  describe('POST /auth/login', () => {


    const credencialesValidas = {
      email: 'juan.perez.dev@gmail.com',
      password: 'Password123!'
    };

    it('Login exitoso: debe retornar 200 y el token JWT', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send(credencialesValidas);

      // login correcto 
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(typeof res.body.token).toBe('string');
    });

    it('Password incorrecta: debe retornar 401 si la contrasena no coincide', async () => {

      // correo bien clave mala
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: credencialesValidas.email,
          password: 'PasswordIncorrecta999'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error');
    });

    it('Email no existe: debe retornar 401 si el email no esta registrado', async () => {

      // usuario  que no esta registrado
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: 'usuario.inexistente.test@gmail.com',
          password: 'Password123!'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error');
    });

    it('Sin credenciales: debe retornar 400 con body vacio', async () => {

      // peticion sin datos en el body
      const res = await request(app)
        .post('/auth/login')
        .send({});

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

});
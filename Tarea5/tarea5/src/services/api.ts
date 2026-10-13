import AsyncStorage from '@react-native-async-storage/async-storage';

// URL de la API viene de variable de entorno
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const api = {

  // 1. Registro: POST /auth/registro
  async registro(nombre: string, email: string, password: string, rol: string) {
    const res = await fetch(`${API_URL}/auth/registro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email, password, rol }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || data.message || 'Error en el registro');
    }
    return data;
  },

  // 2. Login: POST /auth/login
  async login(email: string, password: string) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || data.message || 'Credenciales incorrectas');
    }

    // Guardar token JWT en AsyncStorage
    if (data.token) {
      await AsyncStorage.setItem('@jwt_token', data.token);
    }
    return data.token;
  },

  // 3. Listar tareas: GET /v2/tareas con Bearer token
  async getTareas(token: string) {
    const res = await fetch(`${API_URL}/v2/tareas`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || data.message || 'Error al obtener las tareas');
    }
    return Array.isArray(data) ? data : data.tareas || [];
  },

  // Cerrar sesion eliminar token guardado
  async logout() {
    await AsyncStorage.removeItem('@jwt_token');
  },

  // Obtener token guardado
  async getToken() {
    return await AsyncStorage.getItem('@jwt_token');
  },
};
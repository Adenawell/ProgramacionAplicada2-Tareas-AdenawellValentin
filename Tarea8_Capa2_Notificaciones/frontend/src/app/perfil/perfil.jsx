import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function PerfilScreen() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarDatosUsuario();
  }, []);

  const cargarDatosUsuario = async () => {
    try {
      const storedName = await AsyncStorage.getItem('nombre') || '';
      const storedEmail = await AsyncStorage.getItem('email') || '';
      setNombre(storedName);
      setEmail(storedEmail);
    } catch (e) {
      console.error(e);
    }
  };

  const handleGuardar = async () => {
    if (!nombre.trim()) return Alert.alert('Error', 'El nombre no puede estar vacío');
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${API_URL}/usuarios/perfil`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ nombre })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      await AsyncStorage.setItem('nombre', data.nombre);
      Alert.alert('Éxito', 'Perfil actualizado correctamente');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCerrarSesion = async () => {
    await AsyncStorage.clear();
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi Perfil</Text>
      
      <View style={styles.card}>
        <Text style={styles.label}>Correo Electrónico</Text>
        <TextInput style={[styles.input, styles.disabled]} value={email} editable={false} />

        <Text style={styles.label}>Nombre Completo</Text>
        <TextInput 
          style={styles.input} 
          value={nombre} 
          onChangeText={setNombre} 
          placeholderTextColor="#A9A596"
        />

        {loading ? (
          <ActivityIndicator size="small" color="#81B29A" style={{ marginTop: 20 }} />
        ) : (
          <TouchableOpacity style={styles.saveButton} onPress={handleGuardar}>
            <Text style={styles.saveButtonText}>Guardar Cambios</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleCerrarSesion}>
        <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#141412', padding: 25, justifyContent: 'center' },
  title: { fontSize: 26, fontWeight: '700', color: '#F4F1DE', marginBottom: 25, textAlign: 'center' },
  card: { backgroundColor: '#1E1F1C', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#2C2E29', marginBottom: 20 },
  label: { color: '#A9A596', fontSize: 13, marginBottom: 8, fontWeight: '600' },
  input: { backgroundColor: '#141412', color: '#F4F1DE', padding: 16, borderRadius: 12, fontSize: 16, borderWidth: 1, borderColor: '#2C2E29', marginBottom: 16 },
  disabled: { opacity: 0.6 },
  saveButton: { backgroundColor: '#81B29A', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 5 },
  saveButtonText: { color: '#141412', fontSize: 16, fontWeight: '700' },
  logoutButton: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#E07A5F', padding: 16, borderRadius: 12, alignItems: 'center' },
  logoutButtonText: { color: '#E07A5F', fontSize: 16, fontWeight: '700' }
});
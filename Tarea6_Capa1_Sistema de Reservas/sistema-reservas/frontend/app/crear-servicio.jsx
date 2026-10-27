import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ActivityIndicator, Alert, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.apiUrl;

export default function CrearServicioScreen() {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [duracion, setDuracion] = useState('');
  const [precio, setPrecio] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCrear = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');
    
    try {
      const res = await fetch(`${API_URL}/servicios`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ nombre, descripcion, duracion: Number(duracion), precio: Number(precio) }),
      });
      
      if (res.status === 401 || res.status === 403) {
        await AsyncStorage.clear();
        router.replace('/');
        return;
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      Alert.alert('Éxito', 'Servicio creado correctamente');
      router.back();
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <Text style={styles.title}>Nuevo Servicio</Text>

        <TextInput style={styles.input} placeholder="Nombre del servicio" placeholderTextColor="#94a3b8" value={nombre} onChangeText={setNombre} />
        <TextInput style={styles.input} placeholder="Descripción" placeholderTextColor="#94a3b8" value={descripcion} onChangeText={setDescripcion} multiline />
        <TextInput style={styles.input} placeholder="Duración (minutos)" placeholderTextColor="#94a3b8" value={duracion} onChangeText={setDuracion} keyboardType="numeric" />
        <TextInput style={styles.input} placeholder="Precio" placeholderTextColor="#94a3b8" value={precio} onChangeText={setPrecio} keyboardType="numeric" />
        
        {loading ? (
          <ActivityIndicator size="large" color="#3b82f6" />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleCrear}>
            <Text style={styles.buttonText}>Guardar Servicio</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 25, justifyContent: 'center', backgroundColor: '#0f172a' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#f8fafc', marginBottom: 30, textAlign: 'center' },
  input: { backgroundColor: '#1e293b', color: '#f8fafc', padding: 15, marginBottom: 15, borderRadius: 10, fontSize: 16 },
  button: { backgroundColor: '#2563eb', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' }
});
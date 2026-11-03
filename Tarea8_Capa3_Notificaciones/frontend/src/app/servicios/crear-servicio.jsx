import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ActivityIndicator, Alert, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

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

        <TextInput 
          style={styles.input} 
          placeholder="Nombre del servicio" 
          placeholderTextColor="#A9A596" 
          value={nombre} 
          onChangeText={setNombre} 
        />
        <TextInput 
          style={[styles.input, styles.textArea]} 
          placeholder="Descripción" 
          placeholderTextColor="#A9A596" 
          value={descripcion} 
          onChangeText={setDescripcion} 
          multiline 
        />
        <TextInput 
          style={styles.input} 
          placeholder="Duración (minutos)" 
          placeholderTextColor="#A9A596" 
          value={duracion} 
          onChangeText={setDuracion} 
          keyboardType="numeric" 
        />
        <TextInput 
          style={styles.input} 
          placeholder="Precio" 
          placeholderTextColor="#A9A596" 
          value={precio} 
          onChangeText={setPrecio} 
          keyboardType="numeric" 
        />
        
        {loading ? (
          <ActivityIndicator size="large" color="#81B29A" style={{ marginTop: 20 }} />
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
  container: { flex: 1, padding: 25, justifyContent: 'center', backgroundColor: '#141412' }, 
  title: { fontSize: 26, fontWeight: '700', color: '#F4F1DE', marginBottom: 35, textAlign: 'center' }, 
  input: { backgroundColor: '#1E1F1C', color: '#F4F1DE', padding: 16, marginBottom: 16, borderRadius: 12, fontSize: 16, borderWidth: 1, borderColor: '#2C2E29' },
  button: { backgroundColor: '#81B29A', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 10 }, 
  buttonText: { color: '#141412', fontSize: 16, fontWeight: '700' }
});
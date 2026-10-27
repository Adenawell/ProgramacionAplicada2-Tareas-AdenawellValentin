import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ActivityIndicator, Alert, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function NuevaReservaScreen() {
  const { servicioId, nombreServicio } = useLocalSearchParams();
  
  // Obtener la fecha y hora exacta actual del dispositivo
  const ahora = new Date();
  const hoy = ahora.toISOString().split('T')[0];
  const horaActual = ahora.toTimeString().slice(0, 5);

  const [fecha] = useState(hoy);
  const [hora] = useState(horaActual); 
  const [loading, setLoading] = useState(false);

  const handleReservar = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${API_URL}/reservas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ servicioId: Number(servicioId), fecha, hora }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      Alert.alert('Éxito', 'Reserva creada correctamente');
      router.replace('/reservas');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <Text style={styles.subtitle}>Reservar:</Text>
        <Text style={styles.title}>{nombreServicio}</Text>

        <TextInput 
          style={[styles.input, styles.disabledInput]} 
          value={fecha} 
          editable={false} 
        />
        <TextInput 
          style={[styles.input, styles.disabledInput]} 
          value={hora} 
          editable={false} 
        />
        
        {loading ? (
          <ActivityIndicator size="large" color="#3b82f6" style={{ marginTop: 20 }} />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleReservar}>
            <Text style={styles.buttonText}>Confirmar Reserva</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 25, justifyContent: 'center', backgroundColor: '#0f172a' },
  subtitle: { fontSize: 18, color: '#94a3b8', textAlign: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#60a5fa', marginBottom: 40, textAlign: 'center' },
  input: { backgroundColor: '#1e293b', color: '#f8fafc', padding: 18, marginBottom: 20, borderRadius: 10, fontSize: 16, borderWidth: 1, borderColor: '#334155' },
  disabledInput: { opacity: 0.7 }, // Estilo visual para indicar que está bloqueado
  button: { backgroundColor: '#10b981', padding: 18, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' }
});
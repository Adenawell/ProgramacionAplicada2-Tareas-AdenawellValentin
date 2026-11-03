import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ActivityIndicator, Alert, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications'; 

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
      

      const fechaReserva = new Date(`${fecha}T${hora}:00`);
      const diferenciaHoras = (fechaReserva - ahora) / (1000 * 60 * 60);

      if (diferenciaHoras > 24) {
        const fechaNotificacion = new Date(fechaReserva.getTime() - (24 * 60 * 60 * 1000));
        
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "📅 Recordatorio de Reserva",
            body: `Tienes una reserva para el servicio "${nombreServicio || 'Servicio'}" mañana a las ${hora}.`,
          },
          trigger: { date: fechaNotificacion },
        });
      }


      Alert.alert('Éxito', 'Reserva creada correctamente');
      router.replace('/reservas/index');
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
          <ActivityIndicator size="large" color="#81B29A" style={{ marginTop: 20 }} />
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
  container: { flex: 1, padding: 25, justifyContent: 'center', backgroundColor: '#141412' }, // Fondo carbón cálido
  subtitle: { fontSize: 16, color: '#A9A596', textAlign: 'center', fontWeight: '600' }, // Texto secundario natural
  title: { fontSize: 26, fontWeight: 'bold', color: '#F4F1DE', marginBottom: 35, textAlign: 'center' }, // Marfil suave
  input: { backgroundColor: '#1E1F1C', color: '#F4F1DE', padding: 18, marginBottom: 20, borderRadius: 12, fontSize: 16, borderWidth: 1, borderColor: '#2C2E29' }, // Superficie elegante y bordes sutiles
  disabledInput: { opacity: 0.6 }, 
  button: { backgroundColor: '#81B29A', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 10 }, // Verde salvia elegante
  buttonText: { color: '#141412', fontSize: 18, fontWeight: '700' } // Contraste óptimo sobre el verde salvia
});
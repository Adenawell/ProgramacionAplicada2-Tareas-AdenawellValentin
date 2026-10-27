import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ActivityIndicator, Alert, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.apiUrl;

export default function NuevaReservaScreen() {
  const { servicioId, nombreServicio } = useLocalSearchParams();
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReservar = async () => {
    if (!fecha || !hora) return Alert.alert('Error', 'Ingresa la fecha y la hora');
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

        <TextInput style={styles.input} placeholder="Fecha (YYYY-MM-DD)" placeholderTextColor="#94a3b8" value={fecha} onChangeText={setFecha} />
        <TextInput style={styles.input} placeholder="Hora (HH:MM)" placeholderTextColor="#94a3b8" value={hora} onChangeText={setHora} />
        
        {loading ? <ActivityIndicator size="large" color="#3b82f6" style={{ marginTop: 20 }} /> : 
          <TouchableOpacity style={styles.button} onPress={handleReservar}>
            <Text style={styles.buttonText}>Confirmar Reserva</Text>
          </TouchableOpacity>
        }
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 25, justifyContent: 'center', backgroundColor: '#0f172a' },
  subtitle: { fontSize: 18, color: '#94a3b8', textAlign: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#60a5fa', marginBottom: 40, textAlign: 'center' },
  input: { backgroundColor: '#1e293b', color: '#f8fafc', padding: 18, marginBottom: 20, borderRadius: 10, fontSize: 16, borderWidth: 1, borderColor: '#334155' },
  button: { backgroundColor: '#10b981', padding: 18, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' }
});
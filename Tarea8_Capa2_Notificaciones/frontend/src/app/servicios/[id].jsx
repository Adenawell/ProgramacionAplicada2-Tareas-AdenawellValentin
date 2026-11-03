import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';

export default function DetalleServicioScreen() {
  const { id, nombre, descripcion, precio, duracion } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{nombre}</Text>
      
      <View style={styles.card}>
        <Text style={styles.label}>Descripción:</Text>
        <Text style={styles.value}>{descripcion}</Text>
        <Text style={styles.label}>Duración:</Text>
        <Text style={styles.value}>{duracion} minutos</Text>
        <Text style={styles.label}>Precio:</Text>
        <Text style={styles.price}>${precio}</Text>
      </View>

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => router.push({ pathname: '/reservas/nueva', params: { servicioId: id, nombreServicio: nombre } })}
      >
        <Text style={styles.buttonText}>Reservar este Servicio</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>Volver</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 25, backgroundColor: '#0f172a', justifyContent: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#f8fafc', marginBottom: 30, textAlign: 'center' },
  card: { backgroundColor: '#1e293b', padding: 20, borderRadius: 12, marginBottom: 30, borderWidth: 1, borderColor: '#334155' },
  label: { color: '#94a3b8', fontSize: 14, marginTop: 10 },
  value: { color: '#f8fafc', fontSize: 18, marginBottom: 10 },
  price: { color: '#60a5fa', fontSize: 24, fontWeight: 'bold', marginTop: 5 },
  button: { backgroundColor: '#2563eb', padding: 18, borderRadius: 10, alignItems: 'center', marginBottom: 15 },
  buttonText: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' },
  backButton: { backgroundColor: 'transparent', padding: 15, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#334155' },
  backButtonText: { color: '#94a3b8', fontSize: 16, fontWeight: 'bold' }
});
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
  container: { flex: 1, padding: 25, backgroundColor: '#141412', justifyContent: 'center' }, 
  title: { fontSize: 28, fontWeight: '700', color: '#F4F1DE', marginBottom: 30, textAlign: 'center' },
  card: { backgroundColor: '#1E1F1C', padding: 22, borderRadius: 16, marginBottom: 25, borderWidth: 1, borderColor: '#2C2E29' }, 
  label: { color: '#A9A596', fontSize: 13, marginTop: 10, fontWeight: '600' }, 
  value: { color: '#F4F1DE', fontSize: 16, marginBottom: 10 },
  price: { color: '#81B29A', fontSize: 26, fontWeight: '700', marginTop: 5 }, 
  button: { backgroundColor: '#81B29A', padding: 18, borderRadius: 12, alignItems: 'center', marginBottom: 15 }, 
  buttonText: { color: '#141412', fontSize: 18, fontWeight: '700' },
  backButton: { backgroundColor: 'transparent', padding: 15, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#2C2E29' },
  backButtonText: { color: '#A9A596', fontSize: 16, fontWeight: '700' }
});
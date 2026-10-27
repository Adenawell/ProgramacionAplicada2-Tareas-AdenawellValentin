import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useFocusEffect, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.apiUrl;

export default function MisReservasScreen() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(useCallback(() => { cargarReservas(); }, []));

  const cargarReservas = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${API_URL}/reservas/mis-reservas`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setReservas(data);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = async (id) => {
    Alert.alert('Cancelar', '¿Seguro que deseas cancelar esta reserva?', [
      { text: 'No', style: 'cancel' },
      { text: 'Sí, cancelar', onPress: async () => {
          try {
            const token = await AsyncStorage.getItem('token');
            const res = await fetch(`${API_URL}/reservas/${id}`, {
              method: 'DELETE',
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error);
            }
            Alert.alert('Éxito', 'Reserva cancelada');
            cargarReservas();
          } catch (error) {
            Alert.alert('Error', error.message);
          }
      }, style: 'destructive' }
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis Reservas</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.volverText}>Volver</Text>
        </TouchableOpacity>
      </View>

      {loading ? <ActivityIndicator size="large" color="#3b82f6" style={{ marginTop: 50 }} /> : 
        reservas.length === 0 ? <Text style={styles.emptyText}>No tienes reservas aún.</Text> : (
        <FlatList
          data={reservas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.servicio?.nombre}</Text>
                <Text style={[styles.badge, { backgroundColor: item.estado === 'pendiente' ? '#f59e0b' : item.estado === 'completada' ? '#10b981' : '#ef4444' }]}>
                  {item.estado.toUpperCase()}
                </Text>
              </View>
              <Text style={styles.dateText}>📅 {item.fecha} a las ⏰ {item.hora}</Text>
              
              {item.estado === 'pendiente' && (
                <TouchableOpacity style={styles.cancelButton} onPress={() => handleCancelar(item.id)}>
                  <Text style={styles.cancelButtonText}>Cancelar Reserva</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, backgroundColor: '#0f172a' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, marginTop: 60 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#f8fafc' },
  volverText: { color: '#60a5fa', fontSize: 16, fontWeight: 'bold' },
  emptyText: { color: '#94a3b8', fontSize: 16, textAlign: 'center', marginTop: 40 },
  card: { padding: 18, backgroundColor: '#1e293b', marginBottom: 15, borderRadius: 12, borderWidth: 1, borderColor: '#334155' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#f8fafc', flex: 1 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, color: '#fff', fontSize: 10, fontWeight: 'bold', overflow: 'hidden' },
  dateText: { color: '#cbd5e1', fontSize: 15, marginBottom: 15 },
  cancelButton: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#ef4444', padding: 10, borderRadius: 8, alignItems: 'center' },
  cancelButtonText: { color: '#ef4444', fontWeight: 'bold' }
});
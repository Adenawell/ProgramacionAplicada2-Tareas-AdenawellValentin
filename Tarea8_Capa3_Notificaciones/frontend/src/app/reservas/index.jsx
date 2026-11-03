import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useFocusEffect, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications'; 

const API_URL = process.env.EXPO_PUBLIC_API_URL;

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

  const handleCancelar = async (item) => {
    Alert.alert('Cancelar', '¿Seguro que deseas cancelar esta reserva?', [
      { text: 'No', style: 'cancel' },
      { text: 'Sí, cancelar', onPress: async () => {
          try {
            const token = await AsyncStorage.getItem('token');
            const res = await fetch(`${API_URL}/reservas/${item.id}`, {
              method: 'DELETE',
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error);
            }

            if (item.notificationId) {
              await Notifications.cancelScheduledNotificationAsync(item.notificationId);
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
      {loading ? (
        <ActivityIndicator size="large" color="#81B29A" style={{ marginTop: 50 }} />
      ) : reservas.length === 0 ? (
        <Text style={styles.emptyText}>No tienes reservas aún.</Text>
      ) : (
        <FlatList
          data={reservas}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingTop: 15, paddingBottom: 20 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.servicio?.nombre}</Text>
                <Text style={[styles.badge, { backgroundColor: item.estado === 'pendiente' ? '#F4A261' : item.estado === 'completada' ? '#81B29A' : '#E07A5F' }]}>
                  {item.estado.toUpperCase()}
                </Text>
              </View>
              <Text style={styles.dateText}>📅 {item.fecha} a las ⏰ {item.hora}</Text>
              
              {item.estado === 'pendiente' && (
                <TouchableOpacity style={styles.cancelButton} onPress={() => handleCancelar(item)}>
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
  container: { flex: 1, paddingHorizontal: 20, backgroundColor: '#141412' }, 
  emptyText: { color: '#A9A596', fontSize: 16, textAlign: 'center', marginTop: 40 }, 
  card: { padding: 18, backgroundColor: '#1E1F1C', marginBottom: 15, borderRadius: 16, borderWidth: 1, borderColor: '#2C2E29' }, 
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#F4F1DE', flex: 1 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, color: '#141412', fontSize: 10, fontWeight: 'bold', overflow: 'hidden' },
  dateText: { color: '#A9A596', fontSize: 15, marginBottom: 15 },
  cancelButton: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#E07A5F', padding: 12, borderRadius: 12, alignItems: 'center' }, 
  cancelButtonText: { color: '#E07A5F', fontWeight: '700' }
});
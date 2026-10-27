import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function ServiciosScreen() {
  const [servicios, setServicios] = useState([]);
  const [rol, setRol] = useState('');
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      cargarDatos();
    }, [])
  );

  const cargarDatos = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');
    const userRol = await AsyncStorage.getItem('rol');
    setRol(userRol);

    try {
      const res = await fetch(`${API_URL}/servicios`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.status === 401 || res.status === 403) {
        await AsyncStorage.clear();
        router.replace('/');
        return;
      }
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setServicios(data.servicios || data);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Servicios</Text>
        <TouchableOpacity onPress={async () => { await AsyncStorage.clear(); router.replace('/'); }}>
          <Text style={styles.logoutText}>Salir</Text>
        </TouchableOpacity>
      </View>
      
      {rol === 'admin' && (
        <TouchableOpacity style={styles.adminButton} onPress={() => router.push('/crear-servicio')}>
          <Text style={styles.adminButtonText}>+ Crear Nuevo Servicio</Text>
        </TouchableOpacity>
      )}

      {/* NUEVO BOTÓN: Ver Mis Reservas */}
      <TouchableOpacity style={[styles.adminButton, { borderColor: '#3b82f6', marginBottom: 20 }]} onPress={() => router.push('/reservas')}>
        <Text style={[styles.adminButtonText, { color: '#f8fafc' }]}>📅 Ver Mis Reservas</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#3b82f6" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={servicios}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.card}
              onPress={() => router.push({ 
                pathname: `/servicios/${item.id}`, 
                params: { nombre: item.nombre, descripcion: item.descripcion, precio: item.precio, duracion: item.duracion } 
              })}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.nombre}</Text>
                <Text style={styles.price}>${item.precio}</Text>
              </View>
              <Text style={styles.cardDesc}>{item.descripcion}</Text>
              <Text style={styles.cardDuration}>⏱ {item.duracion} min</Text>
            </TouchableOpacity>
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
  logoutText: { color: '#ef4444', fontSize: 16, fontWeight: 'bold' },
  adminButton: { backgroundColor: '#1e293b', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: '#334155' },
  adminButtonText: { color: '#60a5fa', fontSize: 16, fontWeight: 'bold' },
  card: { padding: 18, backgroundColor: '#1e293b', marginBottom: 15, borderRadius: 12, elevation: 3 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#f8fafc', flex: 1 },
  price: { fontSize: 18, color: '#60a5fa', fontWeight: 'bold', marginLeft: 10 },
  cardDesc: { color: '#94a3b8', marginBottom: 10, lineHeight: 20 },
  cardDuration: { color: '#cbd5e1', fontSize: 14, fontWeight: '500' }
});
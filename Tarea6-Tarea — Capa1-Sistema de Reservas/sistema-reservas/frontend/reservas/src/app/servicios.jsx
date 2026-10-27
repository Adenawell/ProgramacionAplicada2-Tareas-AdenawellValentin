import React, { useState, useCallback } from 'react';
import { View, Text, Button, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.apiUrl;

export default function ServiciosScreen() {
  const [servicios, setServicios] = useState([]);
  const [rol, setRol] = useState('');
  const [loading, setLoading] = useState(true);

  // useFocusEffect recarga los datos cada vez que la pantalla gana foco (ej: al volver de crear servicio)
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
      
      // Regla: Si el token expira o no es válido, redirigir al login
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
        <Button title="Salir" onPress={async () => { await AsyncStorage.clear(); router.replace('/'); }} color="red" />
      </View>
      
      {/* Regla: Crear servicio solo visible si el usuario es admin */}
      {rol === 'admin' && (
        <View style={{ marginBottom: 10 }}>
          <Button title="Crear Servicio" onPress={() => router.push('/crear-servicio')} color="green" />
        </View>
      )}

      {loading ? <ActivityIndicator size="large" color="#0000ff" /> : (
        <FlatList
          data={servicios}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.nombre}</Text>
              <Text>{item.descripcion}</Text>
              <Text>Duración: {item.duracion} min</Text>
              <Text style={styles.price}>${item.precio}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, marginTop: 40 },
  title: { fontSize: 24, fontWeight: 'bold' },
  card: { padding: 15, backgroundColor: '#f9f9f9', marginBottom: 10, borderRadius: 5, borderWidth: 1, borderColor: '#ddd' },
  cardTitle: { fontSize: 18, fontWeight: 'bold' },
  price: { color: 'green', fontWeight: 'bold', marginTop: 5 }
});
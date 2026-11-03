import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ActivityIndicator, Alert, Switch, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import Constants from 'expo-constants';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function RegistroScreen() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [esAdmin, setEsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegistro = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, password, rol: esAdmin ? 'admin' : 'cliente' }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);
      
      Alert.alert('Éxito', 'Cuenta creada. Inicia sesión.');
      router.back();
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Cuenta</Text>

      <TextInput style={styles.input} placeholder="Nombre" placeholderTextColor="#94a3b8" value={nombre} onChangeText={setNombre} />
      <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#94a3b8" value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#94a3b8" value={password} onChangeText={setPassword} secureTextEntry />
      
      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Registrar como Administrador</Text>
        <Switch 
          value={esAdmin} 
          onValueChange={setEsAdmin} 
          trackColor={{ false: '#334155', true: '#2563eb' }}
          thumbColor={esAdmin ? '#ffffff' : '#94a3b8'}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#3b82f6" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleRegistro}>
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 25, justifyContent: 'center', backgroundColor: '#0f172a' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#f8fafc', marginBottom: 30, textAlign: 'center' },
  input: { backgroundColor: '#1e293b', color: '#f8fafc', padding: 15, marginBottom: 15, borderRadius: 10, fontSize: 16 },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30, paddingHorizontal: 5 },
  switchLabel: { color: '#e2e8f0', fontSize: 16 },
  button: { backgroundColor: '#2563eb', padding: 16, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' }
});
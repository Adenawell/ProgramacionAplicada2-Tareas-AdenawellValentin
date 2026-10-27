import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.apiUrl;

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);
      
      await AsyncStorage.setItem('token', data.token);
      await AsyncStorage.setItem('rol', data.rol); 
      
      router.replace('/servicios');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      
      <TextInput 
        style={styles.input} 
        placeholder="Email" 
        placeholderTextColor="#94a3b8" 
        value={email} 
        onChangeText={setEmail} 
        autoCapitalize="none" 
        keyboardType="email-address"
      />
      <TextInput 
        style={styles.input} 
        placeholder="Password" 
        placeholderTextColor="#94a3b8" 
        value={password} 
        onChangeText={setPassword} 
        secureTextEntry 
      />
      
      {loading ? (
        <ActivityIndicator size="large" color="#3b82f6" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      )}
      
      <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push('/registro')}>
        <Text style={styles.secondaryButtonText}>Crear Cuenta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 25, justifyContent: 'center', backgroundColor: '#0f172a' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#f8fafc', marginBottom: 30, textAlign: 'center' },
  input: { backgroundColor: '#1e293b', color: '#f8fafc', padding: 15, marginBottom: 15, borderRadius: 10, fontSize: 16 },
  button: { backgroundColor: '#2563eb', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
  secondaryButton: { backgroundColor: '#334155', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 15 },
  secondaryButtonText: { color: '#e2e8f0', fontSize: 16, fontWeight: 'bold' }
});
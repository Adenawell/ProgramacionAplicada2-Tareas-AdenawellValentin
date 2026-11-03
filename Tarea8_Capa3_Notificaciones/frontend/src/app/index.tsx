import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

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
      if (data.nombre) await AsyncStorage.setItem('nombre', data.nombre);
      if (data.email) await AsyncStorage.setItem('email', data.email);
      
      router.replace('/servicios/servicios');
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
        placeholderTextColor="#A9A596" 
        value={email} 
        onChangeText={setEmail} 
        autoCapitalize="none" 
        keyboardType="email-address"
      />
      <TextInput 
        style={styles.input} 
        placeholder="Password" 
        placeholderTextColor="#A9A596" 
        value={password} 
        onChangeText={setPassword} 
        secureTextEntry 
      />
      
      {loading ? (
        <ActivityIndicator size="large" color="#81B29A" style={{ marginTop: 20 }} />
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
  container: { flex: 1, padding: 25, justifyContent: 'center', backgroundColor: '#141412' }, // Fondo carbón cálido
  title: { fontSize: 26, fontWeight: '700', color: '#F4F1DE', marginBottom: 35, textAlign: 'center' }, // Marfil suave
  input: { backgroundColor: '#1E1F1C', color: '#F4F1DE', padding: 16, marginBottom: 16, borderRadius: 12, fontSize: 16, borderWidth: 1, borderColor: '#2C2E29' }, // Superficie y bordes sutiles
  button: { backgroundColor: '#81B29A', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 10 }, // Verde salvia elegante
  buttonText: { color: '#141412', fontSize: 16, fontWeight: '700' },
  secondaryButton: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#81B29A', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 15 },
  secondaryButtonText: { color: '#81B29A', fontSize: 16, fontWeight: '700' }
});
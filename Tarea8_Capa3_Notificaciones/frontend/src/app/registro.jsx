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

      <TextInput 
        style={styles.input} 
        placeholder="Nombre" 
        placeholderTextColor="#A9A596" 
        value={nombre} 
        onChangeText={setNombre} 
      />
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
      
      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Registrar como Administrador</Text>
        <Switch 
          value={esAdmin} 
          onValueChange={setEsAdmin} 
          trackColor={{ false: '#2C2E29', true: '#81B29A' }}
          thumbColor={esAdmin ? '#141412' : '#A9A596'}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#81B29A" style={{ marginTop: 20 }} />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleRegistro}>
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 25, justifyContent: 'center', backgroundColor: '#141412' }, 
  title: { fontSize: 26, fontWeight: '700', color: '#F4F1DE', marginBottom: 35, textAlign: 'center' }, 
  input: { backgroundColor: '#1E1F1C', color: '#F4F1DE', padding: 16, marginBottom: 16, borderRadius: 12, fontSize: 16, borderWidth: 1, borderColor: '#2C2E29' },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30, paddingHorizontal: 5 },
  switchLabel: { color: '#A9A596', fontSize: 15, fontWeight: '600' }, 
  button: { backgroundColor: '#81B29A', padding: 16, borderRadius: 12, alignItems: 'center' }, 
  buttonText: { color: '#141412', fontSize: 16, fontWeight: '700' }
});
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { api } from '../services/api';

interface Props {
  onLoginSuccess: (token: string) => void;
  onGoToRegister: () => void;
}

export default function LoginView({ onLoginSuccess, onGoToRegister }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Ingresa tu email y password.');
      return;
    }
    setErrorMsg('');
    setLoading(true);

    try {
      const token = await api.login(email, password);
      onLoginSuccess(token);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesion</Text>

      {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="email"
        placeholderTextColor="#64748b"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="password"
        placeholderTextColor="#64748b"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.btnPrimary} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Ingresar</Text>}
      </TouchableOpacity>

      <TouchableOpacity style={styles.linkBtn} onPress={onGoToRegister} disabled={loading}>
        <Text style={styles.linkText}>¿No tienes cuenta? Registrate aqui</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 20 },
  title: { fontSize: 24, fontWeight: '700', color: '#f8fafc', marginBottom: 20 },
  input: {
    backgroundColor: '#111827',
    color: '#fff',
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  btnPrimary: { backgroundColor: '#2563eb', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 4 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  linkBtn: { marginTop: 16, alignItems: 'center' },
  linkText: { color: '#38bdf8', fontSize: 14 },
  errorText: { color: '#f87171', marginBottom: 12, fontSize: 14 },
});
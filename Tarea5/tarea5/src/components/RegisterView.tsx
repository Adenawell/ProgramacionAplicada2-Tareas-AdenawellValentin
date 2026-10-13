import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../services/api';

interface Props {
  onGoToLogin: () => void;
}

export default function RegisterView({ onGoToLogin }: Props) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('user');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = async () => {
    if (!nombre.trim() || !email.trim() || !password.trim()) {
      setErrorMsg('Faltan campos obligatorios.');
      return;
    }
    setErrorMsg('');
    setLoading(true);

    try {
      await api.registro(nombre, email, password, rol);
      Alert.alert('Exito', 'Usuario registrado correctamente');
      onGoToLogin();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro de Usuario</Text>

      {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Nombre completo"
        placeholderTextColor="#64748b"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
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
      <TextInput
        style={styles.input}
        placeholder="Rol (user, admin)"
        placeholderTextColor="#64748b"
        value={rol}
        onChangeText={setRol}
      />

      <TouchableOpacity style={styles.btnPrimary} onPress={handleRegister} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Registrarse</Text>}
      </TouchableOpacity>

      <TouchableOpacity style={styles.linkBtn} onPress={onGoToLogin} disabled={loading}>
        <Text style={styles.linkText}>¿Ya tienes cuenta? Inicia sesion</Text>
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
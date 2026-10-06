import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';

export default function HomeScreen() {
  const [texto, setTexto] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Adenawel Valentin Torres</Text>
      <Text style={styles.subtitulo}>Carnet: [Tu Carnet]</Text>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Escribe algo aqui..."
          value={texto}
          onChangeText={setTexto}
        />
        <Button
          title="Mostrar Texto"
          onPress={() => Alert.alert('Ingresaste:', texto || 'Nada')}
        />
      </View>

      <View style={styles.navButton}>
        <Button
          title="Ir a la Lista"
          onPress={() => router.navigate('/explore' as any)}
          color="#3b82f6"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f8fafc',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 18,
    color: '#64748b',
    marginBottom: 30,
  },
  formContainer: {
    width: '100%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  navButton: {
    marginTop: 30,
    width: '100%',
  }
});
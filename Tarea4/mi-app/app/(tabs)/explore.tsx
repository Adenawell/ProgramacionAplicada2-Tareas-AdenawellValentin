import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import { router } from 'expo-router';

const DATOS = [
  { id: '1', titulo: 'Jugar videojuegos' },
  { id: '2', titulo: 'Instalar Expo y Node' },
  { id: '3', titulo: 'Configurar la FlatList' },
  { id: '4', titulo: 'Probar en celular Samsung o emulador' },
  { id: '5', titulo: 'Subir el repo a GitHub' },
];

export default function ListaScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Lista de Elementos</Text>
      
      <FlatList
        data={DATOS}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemTexto}>{item.titulo}</Text>
          </View>
        )}
        style={styles.lista}
      />

      <Button 
        title="Volver al Home" 
        onPress={() => router.push('/')} 
        color="#ef4444" 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#f8fafc',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#0f172a',
  },
  lista: {
    width: '100%',
    marginBottom: 20,
  },
  item: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 5,
    borderLeftColor: '#10b981',
    elevation: 2,
  },
  itemTexto: {
    fontSize: 16,
    color: '#334155',
  }
});
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { api } from '../services/api';

interface Props {
  token: string;
  onLogout: () => void;
}

export default function TaskDashboard({ token, onLogout }: Props) {
  const [tareas, setTareas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const cargarTareas = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const data = await api.getTareas(token);
      setTareas(data);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarTareas();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis Tareas</Text>
        <TouchableOpacity onPress={onLogout} style={styles.btnLogout}>
          <Text style={styles.btnLogoutText}>Cerrar Sesion</Text>
        </TouchableOpacity>
      </View>

      {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

      {loading ? (
        <ActivityIndicator size="large" color="#38bdf8" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={tareas}
          keyExtractor={(item) => (item.id ? item.id.toString() : Math.random().toString())}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No tienes tareas registradas.</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.titulo || item.title || 'Sin titulo'}</Text>
              {item.descripcion || item.description ? (
                <Text style={styles.cardDesc}>{item.descripcion || item.description}</Text>
              ) : null}
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  title: { fontSize: 22, fontWeight: '700', color: '#f8fafc' },
  btnLogout: { backgroundColor: '#1e293b', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6 },
  btnLogoutText: { color: '#f87171', fontWeight: '600' },
  card: {
    backgroundColor: '#111827',
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  cardTitle: { color: '#f8fafc', fontSize: 16, fontWeight: '600' },
  cardDesc: { color: '#94a3b8', fontSize: 13, marginTop: 4 },
  emptyText: { color: '#64748b', textAlign: 'center', marginTop: 40, fontSize: 14 },
  errorText: { color: '#f87171', textAlign: 'center', marginBottom: 12 },
});
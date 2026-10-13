import React, { useState, useEffect } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, ActivityIndicator } from 'react-native';
import LoginView from '../components/LoginView';
import RegisterView from '../components/RegisterView';
import TaskDashboard from '../components/TaskDashboard';
import { api } from '../services/api';

type Screen = 'login' | 'register' | 'home';

export default function IndexScreen() {
  const [screen, setScreen] = useState<Screen>('login');
  const [token, setToken] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // verificar si ya hay token en AsyncStorage
  useEffect(() => {
    api.getToken()
      .then((savedToken) => {
        if (savedToken) {
          setToken(savedToken);
          setScreen('home');
        } else {
          setScreen('login');
        }
      })
      .finally(() => setCheckingAuth(false));
  }, []);

  const handleLoginSuccess = (userToken: string) => {
    setToken(userToken);
    setScreen('home');
  };

  const handleLogout = async () => {
    await api.logout();
    setToken(null);
    setScreen('login');
  };

  if (checkingAuth) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#2563eb" style={{ flex: 1 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0b0f19" />
      {screen === 'home' && token && (
        <TaskDashboard token={token} onLogout={handleLogout} />
      )}
      {screen === 'login' && (
        <LoginView
          onLoginSuccess={handleLoginSuccess}
          onGoToRegister={() => setScreen('register')}
        />
      )}
      {screen === 'register' && (
        <RegisterView onGoToLogin={() => setScreen('login')} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0f19',
  },
});
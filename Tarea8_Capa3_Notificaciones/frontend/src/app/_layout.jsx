import { Stack } from 'expo-router';
import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function Layout() {
  useEffect(() => {
    const solicitarPermisos = async () => {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        console.log('Permiso de notificaciones no permitido');
      }
    };
    solicitarPermisos();
  }, []);

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#1E1F1C' },
        headerTintColor: '#F4F1DE',
        headerTitleStyle: { fontWeight: '700' },
        contentStyle: { backgroundColor: '#141412' },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="registro" options={{ title: "Crear Cuenta" }} />
      <Stack.Screen name="servicios/servicios" options={{ headerShown: false }} />
      <Stack.Screen name="servicios/crear-servicio" options={{ title: "Nuevo Servicio" }} />
      <Stack.Screen name="servicios/[id]" options={{ title: "Detalle del Servicio" }} />
      <Stack.Screen name="reservas/index" options={{ title: "Mis Reservas" }} />
      <Stack.Screen name="reservas/nueva" options={{ title: "Nueva Reserva" }} />
      <Stack.Screen name="perfil/perfil" options={{ title: "Mi Perfil" }} />
    </Stack>
  );
}
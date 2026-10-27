import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="registro" options={{ title: "Crear Cuenta" }} />
      <Stack.Screen name="servicios/servicios" options={{ headerShown: false }} />
      <Stack.Screen name="servicios/crear-servicio" options={{ title: "Nuevo Servicio" }} />
      <Stack.Screen name="servicios/[id]" options={{ title: "Detalle del Servicio" }} />
      <Stack.Screen name="reservas/index" options={{ title: "Mis Reservas" }} />
      <Stack.Screen name="reservas/nueva" options={{ title: "Nueva Reserva" }} />
    </Stack>
  );
}
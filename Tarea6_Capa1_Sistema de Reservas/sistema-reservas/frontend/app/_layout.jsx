import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="registro" options={{ title: "Crear Cuenta" }} />
      <Stack.Screen name="servicios" options={{ headerShown: false }} />
      <Stack.Screen name="crear-servicio" options={{ title: "Nuevo Servicio" }} />
    </Stack>
  );
}

import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="etiqueta/[tag]"
        options={{ title: 'Recetas por etiqueta' }}
      />

      <Stack.Screen
        name="receta/[id]"
        options={{ title: 'Detalle de receta' }}
      />

      <Stack.Screen
        name="receta/nueva"
        options={{ title: 'Nueva receta' }}
      />

      <Stack.Screen
        name="receta/editar/[id]"
        options={{ title: 'Editar receta' }}
      />
    </Stack>
  );
}

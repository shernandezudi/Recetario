
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Recetas',
          tabBarLabel: 'Recetas',
          headerTitle: 'Recetario',
        }}
      />

      <Tabs.Screen
        name="explorar"
        options={{
          title: 'Explorar',
          tabBarLabel: 'Explorar',
          headerTitle: 'Explorar etiquetas',
        }}
      />
    </Tabs>
  );
}

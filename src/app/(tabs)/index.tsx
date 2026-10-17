
import { StyleSheet, Text, View } from 'react-native';

export default function RecetasScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recetario</Text>
      <Text>Acá aparecerá el listado de recetas.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
});

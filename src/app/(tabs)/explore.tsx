
import { StyleSheet, Text, View } from 'react-native';

export default function ExplorarScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explorar</Text>
      <Text>Acá aparecerán las etiquetas de recetas.</Text>
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

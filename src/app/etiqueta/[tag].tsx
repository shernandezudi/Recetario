import { StyleSheet, Text, View } from 'react-native';

export default function PantallaProvisional() {
  return (
    <View style={styles.container}>
      <Text>Recetas por etiqueta</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
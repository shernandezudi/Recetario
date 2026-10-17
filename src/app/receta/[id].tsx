import { StyleSheet, Text, View } from 'react-native';

export default function PantallaProvisional() {
  return (
    <View style={styles.container}>
      <Text>Detalle de receta</Text>
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
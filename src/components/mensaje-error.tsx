import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colores } from '../constants/colores';

type Props = {
  mensaje: string;
  onReintentar?: () => void;
};

export default function MensajeError({ mensaje, onReintentar }: Props) {
  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Algo salió mal</Text>
      <Text style={styles.mensaje}>{mensaje}</Text>

      {onReintentar ? (
        <Pressable
          accessibilityRole="button"
          style={styles.boton}
          onPress={onReintentar}
        >
          <Text style={styles.textoBoton}>Intentar de nuevo</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
    backgroundColor: Colores.fondo,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colores.error,
  },
  mensaje: {
    fontSize: 16,
    textAlign: 'center',
    color: Colores.texto,
  },
  boton: {
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: Colores.primario,
  },
  textoBoton: {
    color: Colores.textoSobrePrimario,
    fontWeight: 'bold',
  },
});

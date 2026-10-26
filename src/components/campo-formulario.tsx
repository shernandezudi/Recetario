import { Colores } from '..constants/colores';
import { StyleSheet, Text, TextInput, View } from 'react-native';

// Un campo de texto con su etiqueta y su mensaje de error.
// No sabe de recetas: recibe el valor y avisa cuando cambia (como TareaItem en clase).
type Props = {
  etiqueta: string;
  valor: string;
  onCambiarTexto: (texto: string) => void;
  error?: string;
  placeholder?: string;
  numerico?: boolean;
};

export default function CampoFormulario({
  etiqueta,
  valor,
  onCambiarTexto,
  error,
  placeholder,
  numerico = false,
}: Props) {
  return (
    <View style={styles.contenedor}>
      <Text style={styles.etiqueta}>{etiqueta}</Text>
      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        value={valor}
        onChangeText={onCambiarTexto}
        placeholder={placeholder}
        placeholderTextColor={Colores.textoSuave}
        keyboardType={numerico ? 'numeric' : 'default'}
      />
      {error ? <Text style={styles.textoError}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { gap: 4 },
  etiqueta: { fontSize: 14, fontWeight: 'bold', color: Colores.texto },
  input: {
    borderWidth: 1,
    borderColor: Colores.borde,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: Colores.texto,
    backgroundColor: Colores.tarjeta,
  },
  inputError: { borderColor: Colores.error },
  textoError: { fontSize: 13, color: Colores.error },
});

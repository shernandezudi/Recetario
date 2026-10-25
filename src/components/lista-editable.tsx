import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { Colores } from '../constants/colores';

// Lista de textos que se pueden agregar, editar y quitar.
// No guarda estado propio: el array vive en quien la usa (el formulario) y ella
// solo avisa con onChange(nuevoArray). Siempre se crea un array NUEVO (spread, map, filter).
type Props = {
  titulo: string;
  items: string[];
  onChange: (nuevos: string[]) => void;
  placeholder: string;
  textoAgregar: string;
  numerada?: boolean;
  multilinea?: boolean;
  error?: string;
  marcarVacias?: boolean;
};

export default function ListaEditable({
  titulo,
  items,
  onChange,
  placeholder,
  textoAgregar,
  numerada = false,
  multilinea = false,
  error,
  marcarVacias = false,
}: Props) {
  const agregarFila = () => {
    onChange([...items, '']);
  };

  const cambiarFila = (indice: number, texto: string) => {
    onChange(items.map((item, i) => (i === indice ? texto : item)));
  };

  const quitarFila = (indice: number) => {
    onChange(items.filter((item, i) => i !== indice));
  };

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>{titulo}</Text>
      {items.map((item, indice) => {
        const filaVacia = marcarVacias && item.trim() === '';
        return (
          <View key={indice} style={styles.fila}>
            {numerada ? <Text style={styles.numero}>{indice + 1}.</Text> : null}
            <TextInput
              style={[styles.input, multilinea ? styles.inputMultilinea : null, filaVacia ? styles.inputError : null]}
              value={item}
              onChangeText={(texto) => cambiarFila(indice, texto)}
              placeholder={placeholder}
              placeholderTextColor={Colores.textoSuave}
              multiline={multilinea}
            />
            <Pressable style={styles.botonQuitar} onPress={() => quitarFila(indice)}>
              <Text style={styles.textoQuitar}>Quitar</Text>
            </Pressable>
          </View>
        );
      })}
      {error ? <Text style={styles.textoError}>{error}</Text> : null}
      <Pressable style={styles.botonAgregar} onPress={agregarFila}>
        <Text style={styles.textoAgregar}>+ {textoAgregar}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { gap: 8 },
  titulo: { fontSize: 14, fontWeight: 'bold', color: Colores.texto },
  fila: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  numero: { width: 24, fontSize: 16, fontWeight: 'bold', color: Colores.textoSuave },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colores.borde,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: Colores.texto,
    backgroundColor: Colores.tarjeta,
  },
  inputMultilinea: { minHeight: 64, textAlignVertical: 'top' },
  inputError: { borderColor: Colores.error },
  botonQuitar: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: Colores.errorFondo,
  },
  textoQuitar: { fontSize: 13, fontWeight: 'bold', color: Colores.error },
  textoError: { fontSize: 13, color: Colores.error },
  botonAgregar: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: Colores.etiqueta,
  },
  textoAgregar: { fontSize: 14, fontWeight: 'bold', color: Colores.primario },
});

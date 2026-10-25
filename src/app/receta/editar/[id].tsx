import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import FormularioReceta from '../../../components/formulario-receta';
import MensajeError from '../../../components/mensaje-error';
import { Colores } from '../../../constants/colores';
import useReceta from '../../../hooks/use-receta';
import { DatosReceta } from '../../../types/receta';

export default function EditarRecetaScreen() {
  // El id viaja por la URL como texto: lo convertimos a numero
  const { id } = useLocalSearchParams<{ id: string }>();
  const idNumero = Number(id);
  const { receta, cargando, error, reintentar } = useReceta(idNumero);

  if (cargando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color={Colores.primario} />
        <Text style={styles.textoCentro}>Cargando receta...</Text>
      </View>
    );
  }

  if (error !== null) {
    return <MensajeError mensaje={error} onReintentar={reintentar} />;
  }

  if (receta === null) {
    return <MensajeError mensaje="No se encontró la receta." onReintentar={reintentar} />;
  }

  // Datos con los que se precarga el formulario
  const valoresIniciales: DatosReceta = {
    name: receta.name,
    cuisine: receta.cuisine,
    difficulty: receta.difficulty,
    prepTimeMinutes: receta.prepTimeMinutes,
    cookTimeMinutes: receta.cookTimeMinutes,
    servings: receta.servings,
    ingredients: receta.ingredients,
    instructions: receta.instructions,
  };

  return (
    <FormularioReceta
      valoresIniciales={valoresIniciales}
      textoBoton="Guardar cambios"
      enviando={false}
      // Provisorio: el guardado se agrega en el siguiente commit
      onGuardar={() => {}}
    />
  );
}

const styles = StyleSheet.create({
  centro: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: Colores.fondo,
  },
  textoCentro: { fontSize: 16, color: Colores.textoSuave },
});

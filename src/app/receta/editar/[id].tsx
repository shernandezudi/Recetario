import { useState } from 'react';
import { View, Text, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import FormularioReceta from '../../../components/formulario-receta';
import MensajeError from '../../../components/mensaje-error';
import { Colores } from '../../../constants/colores';
import { useRecetas } from '../../../context/recetas-context';
import useReceta from '../../../hooks/use-receta';
import { actualizarReceta } from '../../../../services/recetas';
import { DatosReceta } from '../../../../types/receta';

export default function EditarRecetaScreen() {
  // El id viaja por la URL como texto: lo convertimos a numero
  const { id } = useLocalSearchParams<{ id: string }>();
  const idNumero = Number(id);
  const router = useRouter();
  const { esDeSesion, reemplazarReceta } = useRecetas();
  const { receta, cargando, error, reintentar } = useReceta(idNumero);
  const [enviando, setEnviando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState<string | null>(null);

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

  const handleGuardar = async (datos: DatosReceta) => {
    setEnviando(true);
    setErrorEnvio(null);
    try {
      // Una receta creada en la sesion no existe en DummyJSON: un PUT daria 404.
      // Solo las recetas reales se mandan a la API.
      if (!esDeSesion(receta.id)) {
        await actualizarReceta(receta.id, datos);
      }
      // La API simula la escritura, asi que armamos la receta editada nosotros
      reemplazarReceta({ ...receta, ...datos });
      Alert.alert('Receta actualizada', 'Los cambios se guardaron.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (e) {
      const detalle = e instanceof Error ? e.message : 'error desconocido';
      setErrorEnvio(`No se pudo guardar los cambios (${detalle}). Revisá tu conexión y volvé a tocar Guardar.`);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <FormularioReceta
      valoresIniciales={valoresIniciales}
      textoBoton="Guardar cambios"
      enviando={enviando}
      errorEnvio={errorEnvio}
      onGuardar={handleGuardar}
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

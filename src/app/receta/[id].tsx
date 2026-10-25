import { View, Text, Image, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import MensajeError from '../../components/mensaje-error';
import { Colores } from '../../constants/colores';
import useReceta from '../../hooks/use-receta';
import { traducirDificultad } from '../../utils/formato';

export default function DetalleRecetaScreen() {
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

  return (
    <ScrollView style={styles.pantalla} contentContainerStyle={styles.contenido}>
      {receta.image !== '' ? (
        <Image source={{ uri: receta.image }} style={styles.imagen} />
      ) : (
        <View style={styles.sinImagen}>
          <Text style={styles.textoSinImagen}>Sin imagen</Text>
        </View>
      )}

      <Text style={styles.titulo}>{receta.name}</Text>
      <Text style={styles.subtitulo}>
        {receta.cuisine} · {traducirDificultad(receta.difficulty)}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: Colores.fondo },
  contenido: { padding: 16, gap: 8, paddingBottom: 40 },
  centro: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: Colores.fondo,
  },
  textoCentro: { fontSize: 16, color: Colores.textoSuave },
  imagen: { width: '100%', height: 220, borderRadius: 12 },
  sinImagen: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colores.etiqueta,
  },
  textoSinImagen: { fontSize: 16, color: Colores.textoSuave },
  titulo: { fontSize: 24, fontWeight: 'bold', color: Colores.texto, marginTop: 8 },
  subtitulo: { fontSize: 16, color: Colores.textoSuave },
});

import { View, Text, Image, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import MensajeError from '../../components/mensaje-error';
import { Colores } from '../../constants/colores';
import useReceta from '../../hooks/use-receta';
import { tiempoTotal, traducirDificultad } from '../../utils/formato';

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

      <View style={styles.datos}>
        <View style={styles.dato}>
          <Text style={styles.valorDato}>{receta.prepTimeMinutes} min</Text>
          <Text style={styles.etiquetaDato}>Preparación</Text>
        </View>
        <View style={styles.dato}>
          <Text style={styles.valorDato}>{receta.cookTimeMinutes} min</Text>
          <Text style={styles.etiquetaDato}>Cocción</Text>
        </View>
        <View style={styles.dato}>
          <Text style={styles.valorDato}>{tiempoTotal(receta)} min</Text>
          <Text style={styles.etiquetaDato}>Total</Text>
        </View>
        <View style={styles.dato}>
          <Text style={styles.valorDato}>{receta.servings}</Text>
          <Text style={styles.etiquetaDato}>Porciones</Text>
        </View>
        <View style={styles.dato}>
          <Text style={styles.valorDato}>
            {receta.caloriesPerServing > 0 ? `${receta.caloriesPerServing} kcal` : '—'}
          </Text>
          <Text style={styles.etiquetaDato}>Calorías</Text>
        </View>
      </View>

      <Text style={styles.seccion}>Ingredientes</Text>
      {receta.ingredients.map((ingrediente, indice) => (
        <Text key={indice} style={styles.linea}>
          • {ingrediente}
        </Text>
      ))}

      <Text style={styles.seccion}>Pasos</Text>
      {receta.instructions.map((paso, indice) => (
        <Text key={indice} style={styles.linea}>
          {indice + 1}. {paso}
        </Text>
      ))}
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
  datos: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 8,
  },
  dato: {
    minWidth: 96,
    flexGrow: 1,
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    backgroundColor: Colores.tarjeta,
    borderWidth: 1,
    borderColor: Colores.borde,
  },
  valorDato: { fontSize: 16, fontWeight: 'bold', color: Colores.texto },
  etiquetaDato: { fontSize: 12, color: Colores.textoSuave },
  seccion: { fontSize: 18, fontWeight: 'bold', color: Colores.texto, marginTop: 12 },
  linea: { fontSize: 16, lineHeight: 24, color: Colores.texto },
});


import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { obtenerEtiquetas } from '../../../services/recetas';

export default function ExploreScreen() {
  const router = useRouter();
  const [etiquetas, setEtiquetas] = useState<string[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const cargarEtiquetas = useCallback(async () => {
    setCargando(true);
    setError('');

    try {
      const resultado = await obtenerEtiquetas();
      setEtiquetas(resultado);
    } catch {
      setError('No se pudieron cargar las etiquetas.');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    void cargarEtiquetas();
  }, [cargarEtiquetas]);

  if (cargando) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color="#356747" />
        <Text style={styles.indicacion}>Cargando etiquetas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Explorar</Text>
      <Text style={styles.subtitulo}>
        Encontrá recetas por categoría
      </Text>

      {error ? (
        <View style={styles.centrado}>
          <Text style={styles.error}>{error}</Text>
          <Pressable style={styles.boton} onPress={() => void cargarEtiquetas()}>
            <Text style={styles.textoBoton}>Reintentar</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={etiquetas}
          keyExtractor={(item) => item}
          numColumns={2}
          columnWrapperStyle={styles.fila}
          contentContainerStyle={styles.lista}
          renderItem={({ item }) => (
            <Pressable
              style={styles.tarjeta}
              onPress={() =>
                router.push({
                  pathname: '/etiqueta/[tag]',
                  params: { tag: item },
                })
              }
            >
              <Text style={styles.nombreEtiqueta}>
                {item.replace(/-/g, ' ')}
              </Text>
              <Text style={styles.indicacion}>Ver recetas →</Text>
            </Pressable>
          )}
          ListEmptyComponent={
            <Text style={styles.indicacion}>
              No hay etiquetas disponibles.
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 24,
    backgroundColor: '#F7F7F2',
  },
  centrado: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#25382B',
    marginBottom: 6,
  },
  subtitulo: {
    fontSize: 16,
    color: '#666',
    marginBottom: 18,
  },
  lista: {
    paddingBottom: 20,
  },
  fila: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  tarjeta: {
    flex: 1,
    minHeight: 110,
    marginHorizontal: 4,
    padding: 14,
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  nombreEtiqueta: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#25382B',
    textTransform: 'capitalize',
    marginBottom: 8,
  },
  indicacion: {
    fontSize: 13,
    color: '#666',
  },
  boton: {
    backgroundColor: '#356747',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 12,
  },
  textoBoton: {
    color: '#fff',
    fontWeight: 'bold',
  },
  error: {
    color: '#B42318',
    textAlign: 'center',
  },
});

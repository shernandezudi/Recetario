
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { obtenerEtiquetas } from '../../../services/recetas';

export default function ExplorarScreen() {
  const router = useRouter();

  const [etiquetas, setEtiquetas] = useState<string[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let activo = true;

    async function cargarEtiquetas() {
      try {
        setError('');

        const resultado = await obtenerEtiquetas();

        if (activo) {
          setEtiquetas(resultado);
        }
      } catch {
        if (activo) {
          setError('No se pudieron cargar las etiquetas. Intentá nuevamente.');
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    }

    cargarEtiquetas();

    return () => {
      activo = false;
    };
  }, []);

  if (cargando) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" />
        <Text>Cargando etiquetas...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centrado}>
        <Text style={styles.error}>{error}</Text>

        <Pressable
          style={styles.boton}
          onPress={() => {
            setCargando(true);
            setError('');
            obtenerEtiquetas()
              .then(setEtiquetas)
              .catch(() =>
                setError('No se pudieron cargar las etiquetas. Intentá nuevamente.')
              )
              .finally(() => setCargando(false));
          }}
        >
          <Text style={styles.textoBoton}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Explorar etiquetas</Text>
      <Text style={styles.subtitulo}>
        Elegí una etiqueta para descubrir recetas.
      </Text>

      <FlatList
        data={etiquetas}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.lista}
        numColumns={2}
        columnWrapperStyle={styles.fila}
        ListEmptyComponent={
          <Text style={styles.subtitulo}>
            No hay etiquetas disponibles.
          </Text>
        }
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
            <Text style={styles.nombreEtiqueta}>{item}</Text>
            <Text style={styles.indicacion}>Ver recetas →</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  centrado: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 12,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 15,
    color: '#666',
    marginBottom: 16,
  },
  lista: {
    paddingBottom: 20,
  },
  fila: {
    gap: 12,
    marginBottom: 12,
  },
  tarjeta: {
    flex: 1,
    minHeight: 100,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#f0f5ec',
    justifyContent: 'center',
  },
  nombreEtiqueta: {
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    marginBottom: 8,
  },
  indicacion: {
    fontSize: 13,
    color: '#47733d',
  },
  boton: {
    backgroundColor: '#2e7d32',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
  },
  textoBoton: {
    color: '#fff',
    fontWeight: 'bold',
  },
  error: {
    textAlign: 'center',
    color: '#b00020',
  },
});

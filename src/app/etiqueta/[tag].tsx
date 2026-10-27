
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { obtenerRecetasPorEtiqueta } from '../../../services/recetas';
import type { Receta } from '../../../types/receta';

export default function PantallaRecetasPorEtiqueta() {
  const { tag } = useLocalSearchParams<{ tag: string }>();
  const router = useRouter();

  const [recetas, setRecetas] = useState<Receta[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let activo = true;

    async function cargar() {
      if (!tag) {
        setError('No se especificó una etiqueta.');
        setCargando(false);
        return;
      }

      setCargando(true);
      setError('');

      try {
        const respuesta = await obtenerRecetasPorEtiqueta(tag);

        if (activo) {
          setRecetas(respuesta.recipes);
        }
      } catch {
        if (activo) {
          setError(
            'No se pudieron cargar las recetas de esta etiqueta.'
          );
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    }

    void cargar();

    return () => {
      activo = false;
    };
  }, [tag]);

  async function reintentar() {
    if (!tag) {
      setError('No se especificó una etiqueta.');
      return;
    }

    setCargando(true);
    setError('');

    try {
      const respuesta = await obtenerRecetasPorEtiqueta(tag);
      setRecetas(respuesta.recipes);
    } catch {
      setError(
        'No se pudieron cargar las recetas de esta etiqueta.'
      );
    } finally {
      setCargando(false);
    }
  }

  if (cargando) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color="#356747" />
        <Text style={styles.mensaje}>Cargando recetas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.botonVolver}
        onPress={() => router.back()}
      >
        <Text style={styles.textoVolver}>‹ Volver</Text>
      </Pressable>

      <Text style={styles.titulo}>
        {tag ? tag.replace(/-/g, ' ') : 'Recetas'}
      </Text>

      {error ? (
        <View style={styles.mensajeError}>
          <Text style={styles.error}>{error}</Text>
          <Pressable onPress={() => void reintentar()}>
            <Text style={styles.textoReintentar}>Reintentar</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={recetas}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.lista}
          renderItem={({ item }) => (
            <Pressable
              style={styles.tarjeta}
              onPress={() =>
                router.push({
                  pathname: '/receta/[id]',
                  params: { id: String(item.id) },
                })
              }
            >
              <Image
                source={{ uri: item.image }}
                style={styles.imagen}
                resizeMode="cover"
              />

              <View style={styles.contenidoTarjeta}>
                <Text style={styles.nombre}>{item.name}</Text>
                <Text style={styles.detalle}>
                  {item.cuisine} · {item.difficulty}
                </Text>
                <Text style={styles.detalle}>
                  Preparación: {item.prepTimeMinutes} min
                </Text>
              </View>
            </Pressable>
          )}
          ListEmptyComponent={
            <Text style={styles.vacio}>
              No hay recetas para esta etiqueta.
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
    backgroundColor: '#F7F7F2',
  },
  centrado: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  botonVolver: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginBottom: 12,
  },
  textoVolver: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#356747',
  },
  titulo: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#25382B',
    marginBottom: 16,
    textTransform: 'capitalize',
  },
  lista: {
    paddingBottom: 20,
  },
  tarjeta: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  imagen: {
    width: 110,
    height: 115,
  },
  contenidoTarjeta: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
    gap: 5,
  },
  nombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#25382B',
  },
  detalle: {
    fontSize: 13,
    color: '#555',
  },
  mensajeError: {
    alignItems: 'center',
    padding: 20,
  },
  error: {
    color: '#B42318',
    textAlign: 'center',
    marginBottom: 8,
  },
  textoReintentar: {
    color: '#356747',
    fontWeight: 'bold',
    padding: 8,
  },
  mensaje: {
    marginTop: 12,
    fontSize: 16,
  },
  vacio: {
    textAlign: 'center',
    marginTop: 24,
    fontSize: 16,
    color: '#666',
  },
});

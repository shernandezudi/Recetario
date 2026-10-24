
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

export default function PantallaEtiqueta() {
  const { tag } = useLocalSearchParams<{ tag: string }>();
  const router = useRouter();

  const [recetas, setRecetas] = useState<Receta[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let activo = true;

    async function cargarRecetas() {
      try {
        setCargando(true);
        setError('');

        const respuesta = await obtenerRecetasPorEtiqueta(tag);

        if (activo) {
          setRecetas(respuesta.recipes);
        }
      } catch {
        if (activo) {
          setError('No se pudieron cargar las recetas de esta etiqueta.');
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    }

    if (tag) {
      cargarRecetas();
    }

    return () => {
      activo = false;
    };
  }, [tag]);

  if (cargando) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" />
        <Text>Cargando recetas...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centrado}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        Etiqueta: {tag}
      </Text>

      <FlatList
        data={recetas}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={
          <Text style={styles.mensajeVacio}>
            No hay recetas para esta etiqueta.
          </Text>
        }
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
            />

            <View style={styles.informacion}>
              <Text style={styles.nombre}>{item.name}</Text>
              <Text>{item.cuisine}</Text>
              <Text>⭐ {item.rating}</Text>
            </View>
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
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  lista: {
    paddingBottom: 20,
  },
  tarjeta: {
    flexDirection: 'row',
    marginBottom: 14,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    overflow: 'hidden',
  },
  imagen: {
    width: 110,
    height: 110,
  },
  informacion: {
    flex: 1,
    justifyContent: 'center',
    padding: 12,
    gap: 5,
  },
  nombre: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  mensajeVacio: {
    textAlign: 'center',
    marginTop: 24,
    color: '#666',
  },
});

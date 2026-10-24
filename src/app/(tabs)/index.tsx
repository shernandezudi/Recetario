
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

import { obtenerRecetas } from '../../../services/recetas';
import type { Receta } from '../../../types/receta';

export default function RecetasScreen() {
  const [recetas, setRecetas] = useState<Receta[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  async function cargarRecetas() {
    try {
      setError('');
      setCargando(true);

      const respuesta = await obtenerRecetas();
      setRecetas(respuesta.recipes);
    } catch {
      setError('No se pudieron cargar las recetas. Intentá nuevamente.');
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
  async function iniciarCarga() {
    try {
      const respuesta = await obtenerRecetas();
      setRecetas(respuesta.recipes);
    } catch {
      setError('No se pudieron cargar las recetas. Intentá nuevamente.');
    } finally {
      setCargando(false);
    }
  }

  iniciarCarga();
}, []);

  if (cargando) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" />
        <Text style={styles.mensaje}>Cargando recetas...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centrado}>
        <Text style={styles.error}>{error}</Text>
        <Pressable style={styles.boton} onPress={cargarRecetas}>
          <Text style={styles.textoBoton}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recetario</Text>
      <Text style={styles.subtitulo}>
        Explorá nuestras recetas
      </Text>

      <FlatList
        data={recetas}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={
          <Text style={styles.mensaje}>No hay recetas para mostrar.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.tarjeta}>
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
              <Text style={styles.detalle}>
                Calificación: {item.rating}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 24,
  },
  centrado: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
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
    width: 115,
    height: 125,
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
  },
  detalle: {
    fontSize: 13,
    color: '#555',
  },
  mensaje: {
    marginTop: 12,
    fontSize: 16,
    textAlign: 'center',
  },
  error: {
    color: '#c62828',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  boton: {
    backgroundColor: '#333',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  textoBoton: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

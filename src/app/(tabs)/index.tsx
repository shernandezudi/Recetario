
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useRecetas } from '../../context/recetas-context';

export default function RecetasScreen() {
  const router = useRouter();
  const [busqueda, setBusqueda] = useState('');
  const [buscando, setBuscando] = useState(false);

  const {
    recetas,
    cargando,
    error,
    cargarRecetas,
    buscarRecetasEnContexto,
  } = useRecetas();

  useEffect(() => {
    cargarRecetas().catch(() => {});
  }, [cargarRecetas]);

  async function ejecutarBusqueda() {
    setBuscando(true);

    try {
      if (busqueda.trim() === '') {
        await cargarRecetas();
      } else {
        await buscarRecetasEnContexto(busqueda.trim());
      }
    } catch {
      // El contexto administra el mensaje de error.
    } finally {
      setBuscando(false);
    }
  }

  function reintentar() {
    if (busqueda.trim() !== '') {
      void buscarRecetasEnContexto(busqueda.trim()).catch(() => {});
    } else {
      void cargarRecetas().catch(() => {});
    }
  }

  if (cargando && recetas.length === 0) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color="#356747" />
        <Text style={styles.mensaje}>Cargando recetas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Recetario</Text>
      <Text style={styles.subtitulo}>
        Explorá nuestras recetas
      </Text>

      <View style={styles.buscador}>
        <TextInput
          style={styles.campoBusqueda}
          placeholder="Buscar recetas..."
          value={busqueda}
          onChangeText={setBusqueda}
          onSubmitEditing={() => void ejecutarBusqueda()}
          returnKeyType="search"
        />

        <Pressable
          style={styles.botonBuscar}
          onPress={() => void ejecutarBusqueda()}
          disabled={buscando || cargando}
        >
          <Text style={styles.textoBotonBuscar}>
            {buscando ? 'Buscando...' : 'Buscar'}
          </Text>
        </Pressable>
      </View>

      {error ? (
        <View style={styles.mensajeError}>
          <Text style={styles.error}>{error}</Text>
          <Pressable onPress={reintentar}>
            <Text style={styles.reintentar}>Reintentar</Text>
          </Pressable>
        </View>
      ) : null}

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
              <Text style={styles.detalle}>
                Calificación: {item.rating}
              </Text>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          !cargando && !error ? (
            <Text style={styles.mensajeVacio}>
              No se encontraron recetas.
            </Text>
          ) : null
        }
      />
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
  buscador: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  campoBusqueda: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D8DED5',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    color: '#222',
  },
  botonBuscar: {
    backgroundColor: '#356747',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
  },
  textoBotonBuscar: {
    color: '#fff',
    fontWeight: 'bold',
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
    color: '#25382B',
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
  mensajeError: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  error: {
    color: '#B42318',
    textAlign: 'center',
    marginBottom: 8,
  },
  reintentar: {
    color: '#356747',
    fontWeight: 'bold',
    padding: 8,
  },
  mensajeVacio: {
    textAlign: 'center',
    marginTop: 24,
    fontSize: 16,
    color: '#666',
  },
});

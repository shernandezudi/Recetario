
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

  const ejecutarBusqueda = async () => {
    if (!busqueda.trim()) {
      try {
        await cargarRecetas();
      } catch {
        // El contexto ya guarda el mensaje de error.
      }
      return;
    }

    try {
      setBuscando(true);
      await buscarRecetasEnContexto(busqueda);
    } catch {
      // El contexto ya guarda el mensaje de error.
    } finally {
      setBuscando(false);
    }
  };

  useEffect(() => {
    cargarRecetas().catch(() => {
      // El contexto ya guarda el mensaje de error.
    });
  }, [cargarRecetas]);

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

      <View style={styles.buscador}>
        <TextInput
          style={styles.campoBusqueda}
          placeholder="Buscar recetas..."
          value={busqueda}
          onChangeText={setBusqueda}
          onSubmitEditing={ejecutarBusqueda}
          returnKeyType="search"
        />

        <Pressable
          style={styles.botonBuscar}
          onPress={ejecutarBusqueda}
          disabled={buscando}
        >
          <Text style={styles.textoBotonBuscar}>
            {buscando ? 'Buscando...' : 'Buscar'}
          </Text>
        </Pressable>
      </View>

      <FlatList
        data={recetas}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={
          !cargando && !buscando && !error ? (
            <Text style={styles.mensajeVacio}>
              No se encontraron recetas.
            </Text>
          ) : null
        }
        renderItem={({ item }) => (

          //detalles de productos
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
  buscador: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 16,
  },

  campoBusqueda: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    color: '#222',
  },

  botonBuscar: {
    backgroundColor: '#2e7d32',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
  },

  textoBotonBuscar: {
    color: '#fff',
    fontWeight: 'bold',
  },
  
  mensajeVacio: {
  textAlign: 'center',
  marginTop: 24,
  fontSize: 16,
  color: '#666',
},
});

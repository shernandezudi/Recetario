import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { obtenerRecetasPorEtiqueta } from "../../../services/recetas";
import type { Receta } from "../../../types/receta";
import TarjetaReceta from "../../components/tarjeta-receta";

export default function PantallaRecetasPorEtiqueta() {
  const { tag } = useLocalSearchParams<{ tag: string }>();
  const router = useRouter();

  const [recetas, setRecetas] = useState<Receta[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  async function cargarRecetas() {
    if (!tag) {
      setError("No se especificó una etiqueta.");
      setCargando(false);
      return;
    }

    setCargando(true);
    setError("");

    try {
      const respuesta = await obtenerRecetasPorEtiqueta(tag);
      setRecetas(respuesta.recipes);
    } catch {
      setError("No se pudieron cargar las recetas de esta categoría.");
    } finally {
      setCargando(false);
    }
  }

  function volver() {
    router.back();
  }

  function reintentar() {
    void cargarRecetas();
  }

  useEffect(() => {
    void cargarRecetas();
  }, [tag]);

  return (
    <View style={styles.container}>
      <Pressable style={styles.botonVolver} onPress={volver}>
        <Text style={styles.textoVolver}>‹ Volver</Text>
      </Pressable>

      <Text style={styles.titulo}>
        {tag ? tag.replace(/-/g, " ") : "Recetas"}
      </Text>

      {cargando ? (
        <ActivityIndicator size="large" color="#356747" style={styles.carga} />
      ) : error ? (
        <View style={styles.mensaje}>
          <Text style={styles.error}>{error}</Text>
          <Pressable onPress={reintentar}>
            <Text style={styles.reintentar}>Reintentar</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={recetas}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <TarjetaReceta receta={item} />}
          contentContainerStyle={styles.lista}
          ListEmptyComponent={
            <Text style={styles.mensaje}>
              No se encontraron recetas para esta categoría.
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
    backgroundColor: "#F7F7F2",
  },
  botonVolver: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginBottom: 12,
  },
  textoVolver: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#356747",
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#25382B",
    marginBottom: 16,
    textTransform: "capitalize",
  },
  lista: {
    paddingBottom: 24,
  },
  carga: {
    marginTop: 30,
  },
  mensaje: {
    alignItems: "center",
    padding: 20,
  },
  error: {
    color: "#B42318",
    textAlign: "center",
    marginBottom: 8,
  },
  reintentar: {
    color: "#356747",
    fontWeight: "bold",
    padding: 8,
  },
});

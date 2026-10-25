import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { obtenerEtiquetas } from "../../../services/recetas";

export default function ExplorarScreen() {
  const router = useRouter();

  const [etiquetas, setEtiquetas] = useState<string[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  async function cargarEtiquetas() {
    setCargando(true);
    setError("");

    try {
      const resultado = await obtenerEtiquetas();
      setEtiquetas(resultado);
    } catch {
      setError("No se pudieron cargar las etiquetas.");
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    void cargarEtiquetas();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Explorar recetas</Text>
      <Text style={styles.subtitulo}>Descubrí recetas por categoría</Text>

      {cargando ? (
        <ActivityIndicator size="large" color="#356747" style={styles.carga} />
      ) : error ? (
        <View style={styles.mensaje}>
          <Text style={styles.error}>{error}</Text>
          <TouchableOpacity onPress={() => void cargarEtiquetas()}>
            <Text style={styles.reintentar}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.lista}>
          {etiquetas.map((etiqueta) => (
            <TouchableOpacity
              key={etiqueta}
              style={styles.botonEtiqueta}
              onPress={() =>
                router.push({
                  pathname: "/etiqueta/[tag]",
                  params: { tag: etiqueta },
                })
              }
            >
              <Text style={styles.textoEtiqueta}>{etiqueta}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F7F7F2",
  },
  titulo: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#25382B",
    marginBottom: 6,
  },
  subtitulo: {
    fontSize: 15,
    color: "#555555",
    marginBottom: 20,
  },
  lista: {
    paddingBottom: 24,
    gap: 10,
  },
  botonEtiqueta: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D8DED5",
    borderRadius: 10,
    padding: 16,
  },
  textoEtiqueta: {
    fontSize: 16,
    fontWeight: "600",
    color: "#356747",
    textTransform: "capitalize",
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

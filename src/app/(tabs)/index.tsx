import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { buscarRecetas, obtenerRecetas } from "../../../services/recetas";
import type { Receta } from "../../../types/receta";
import TarjetaReceta from "../../components/tarjeta-receta";

const LIMITE = 10;

export default function RecetasScreen() {
  const [recetas, setRecetas] = useState<Receta[]>([]);
  const [consulta, setConsulta] = useState("");
  const [busquedaActiva, setBusquedaActiva] = useState("");
  const [total, setTotal] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [cargandoMas, setCargandoMas] = useState(false);
  const [error, setError] = useState("");

  async function cargarRecetas(nuevaConsulta = "") {
    setCargando(true);
    setError("");
    setBusquedaActiva(nuevaConsulta.trim());

    try {
      const respuesta = nuevaConsulta.trim()
        ? await buscarRecetas(nuevaConsulta.trim())
        : await obtenerRecetas(LIMITE, 0);

      setRecetas(respuesta.recipes);
      setTotal(respuesta.total);
    } catch {
      setError("No se pudieron cargar las recetas.");
    } finally {
      setCargando(false);
    }
  }

  async function cargarMasRecetas() {
    if (
      cargando ||
      cargandoMas ||
      busquedaActiva !== "" ||
      recetas.length >= total
    ) {
      return;
    }

    setCargandoMas(true);
    setError("");

    try {
      const respuesta = await obtenerRecetas(LIMITE, recetas.length);

      setRecetas((anteriores) => {
        const idsExistentes = anteriores.map((receta) => receta.id);
        const nuevas = respuesta.recipes.filter(
          (receta) => !idsExistentes.includes(receta.id),
        );

        return [...anteriores, ...nuevas];
      });

      setTotal(respuesta.total);
    } catch {
      setError("No se pudieron cargar más recetas.");
    } finally {
      setCargandoMas(false);
    }
  }

  useEffect(() => {
    void cargarRecetas();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Recetario</Text>

      <TextInput
        style={styles.busqueda}
        placeholder="Buscar recetas..."
        value={consulta}
        onChangeText={setConsulta}
        onSubmitEditing={() => void cargarRecetas(consulta)}
        returnKeyType="search"
      />

      <TouchableOpacity
        style={styles.botonBuscar}
        onPress={() => void cargarRecetas(consulta)}
        disabled={cargando}
      >
        <Text style={styles.textoBoton}>Buscar</Text>
      </TouchableOpacity>

      {cargando ? (
        <ActivityIndicator size="large" color="#356747" style={styles.carga} />
      ) : error && recetas.length === 0 ? (
        <View style={styles.mensaje}>
          <Text style={styles.error}>{error}</Text>
          <TouchableOpacity onPress={() => void cargarRecetas(busquedaActiva)}>
            <Text style={styles.reintentar}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <Text style={styles.resultados}>{total} recetas encontradas</Text>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <FlatList
            style={styles.lista}
            data={recetas}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => <TarjetaReceta receta={item} />}
            contentContainerStyle={styles.contenidoLista}
            ListEmptyComponent={
              <Text style={styles.mensaje}>No se encontraron recetas.</Text>
            }
          />

          {busquedaActiva === "" && recetas.length < total ? (
            cargandoMas ? (
              <ActivityIndicator
                size="small"
                color="#356747"
                style={styles.carga}
              />
            ) : (
              <TouchableOpacity
                style={styles.botonMas}
                onPress={() => void cargarMasRecetas()}
              >
                <Text style={styles.textoBoton}>Cargar más recetas</Text>
              </TouchableOpacity>
            )
          ) : null}
        </>
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
  titulo: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#25382B",
    marginBottom: 16,
  },
  busqueda: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D8DED5",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },
  botonBuscar: {
    backgroundColor: "#356747",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 12,
  },
  textoBoton: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 15,
  },
  resultados: {
    fontSize: 14,
    color: "#555555",
    marginBottom: 12,
  },
  lista: {
    flex: 1,
  },
  contenidoLista: {
    paddingBottom: 12,
  },
  carga: {
    margin: 12,
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
  botonMas: {
    backgroundColor: "#356747",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
    marginTop: 8,
  },
});

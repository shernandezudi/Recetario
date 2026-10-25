import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
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

  const solicitudActual = useRef(0);
  const cargaEnCurso = useRef(false);

  async function cargarRecetas(nuevaConsulta = "") {
    const numeroSolicitud = solicitudActual.current + 1;
    solicitudActual.current = numeroSolicitud;
    const busqueda = nuevaConsulta.trim();

    cargaEnCurso.current = false;
    setCargando(true);
    setCargandoMas(false);
    setError("");
    setRecetas([]);
    setTotal(0);
    setBusquedaActiva(busqueda);

    try {
      const respuesta = busqueda
        ? await buscarRecetas(busqueda)
        : await obtenerRecetas(LIMITE, 0);

      if (numeroSolicitud !== solicitudActual.current) {
        return;
      }

      setRecetas(respuesta.recipes);
      setTotal(respuesta.total);
    } catch {
      if (numeroSolicitud === solicitudActual.current) {
        setError("No se pudieron cargar las recetas.");
      }
    } finally {
      if (numeroSolicitud === solicitudActual.current) {
        setCargando(false);
      }
    }
  }

  async function cargarMasRecetas() {
    if (
      cargando ||
      cargaEnCurso.current ||
      busquedaActiva !== "" ||
      recetas.length >= total
    ) {
      return;
    }

    cargaEnCurso.current = true;
    const numeroSolicitud = solicitudActual.current;

    setCargandoMas(true);
    setError("");

    try {
      const respuesta = await obtenerRecetas(LIMITE, recetas.length);

      if (numeroSolicitud !== solicitudActual.current) {
        return;
      }

      setRecetas((anteriores) => {
        const idsExistentes = anteriores.map((receta) => receta.id);
        const nuevas = respuesta.recipes.filter(
          (receta) => !idsExistentes.includes(receta.id),
        );

        return [...anteriores, ...nuevas];
      });

      setTotal(respuesta.total);
    } catch {
      if (numeroSolicitud === solicitudActual.current) {
        setError("No se pudieron cargar más recetas.");
      }
    } finally {
      cargaEnCurso.current = false;

      if (numeroSolicitud === solicitudActual.current) {
        setCargandoMas(false);
      }
    }
  }

  function buscar() {
    void cargarRecetas(consulta);
  }

  function reintentar() {
    void cargarRecetas(busquedaActiva);
  }

  function reintentarCarga() {
    void cargarMasRecetas();
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
        onSubmitEditing={buscar}
        returnKeyType="search"
      />

      <Pressable
        style={styles.botonBuscar}
        onPress={buscar}
        disabled={cargando}
      >
        <Text style={styles.textoBoton}>Buscar</Text>
      </Pressable>

      {cargando ? (
        <ActivityIndicator size="large" color="#356747" style={styles.carga} />
      ) : error && recetas.length === 0 ? (
        <View style={styles.mensaje}>
          <Text style={styles.error}>{error}</Text>
          <Pressable onPress={reintentar}>
            <Text style={styles.reintentar}>Reintentar</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <Text style={styles.resultados}>{total} recetas encontradas</Text>

          {error ? (
            <View style={styles.mensajeError}>
              <Text style={styles.error}>{error}</Text>

              {busquedaActiva === "" && recetas.length < total ? (
                <Pressable onPress={reintentarCarga}>
                  <Text style={styles.reintentar}>Reintentar carga</Text>
                </Pressable>
              ) : (
                <Pressable onPress={reintentar}>
                  <Text style={styles.reintentar}>Reintentar búsqueda</Text>
                </Pressable>
              )}
            </View>
          ) : null}

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
              <Pressable style={styles.botonMas} onPress={reintentarCarga}>
                <Text style={styles.textoBoton}>Cargar más recetas</Text>
              </Pressable>
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
  mensajeError: {
    alignItems: "center",
    paddingVertical: 8,
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

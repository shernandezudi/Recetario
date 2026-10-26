import { useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import type { Receta } from "../../types/receta";

type Props = {
  receta: Receta;
};

const nombresDificultad: Record<Receta["difficulty"], string> = {
  Easy: "Fácil",
  Medium: "Media",
  Hard: "Difícil",
};

export default function TarjetaReceta({ receta }: Props) {
  const router = useRouter();
  const tiempoTotal = receta.prepTimeMinutes + receta.cookTimeMinutes;

  return (
    <Pressable
      style={styles.tarjeta}
      onPress={() =>
        router.push({
          pathname: "/receta/[id]",
          params: { id: String(receta.id) },
        })
      }
    >
      <Image
        source={{ uri: receta.image }}
        style={styles.imagen}
        resizeMode="cover"
      />

      <View style={styles.contenido}>
        <Text style={styles.nombre}>{receta.name}</Text>

        <View style={styles.detalles}>
          <Text style={styles.texto}>
            {nombresDificultad[receta.difficulty]}
          </Text>

          <Text style={styles.texto}>{tiempoTotal} min</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#D8DED5",
  },
  imagen: {
    width: "100%",
    height: 180,
  },
  contenido: {
    padding: 14,
  },
  nombre: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#25382B",
    marginBottom: 10,
  },
  detalles: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  texto: {
    fontSize: 14,
    color: "#555555",
  },
});

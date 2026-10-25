import { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import CampoFormulario from './campo-formulario';
import ListaEditable from './lista-editable';
import { Colores } from '../constants/colores';
import { DatosReceta, Dificultad } from '../types/receta';
import { traducirDificultad } from '../utils/formato';

// Formulario unico para ALTA y EDICION.
// No llama a servicios ni al contexto: valida y le entrega los datos a quien lo usa (onGuardar).
type Props = {
  valoresIniciales?: DatosReceta;
  textoBoton: string;
  onGuardar: (datos: DatosReceta) => void;
};

const OPCIONES_DIFICULTAD: Dificultad[] = ['Easy', 'Medium', 'Hard'];

// ---------- Componente ----------

export default function FormularioReceta({ valoresIniciales, textoBoton, onGuardar }: Props) {
  // El valor inicial de useState se usa una sola vez: asi se precarga la edicion.
  const [nombre, setNombre] = useState(valoresIniciales?.name ?? '');
  const [cocina, setCocina] = useState(valoresIniciales?.cuisine ?? '');
  const [dificultad, setDificultad] = useState<Dificultad | null>(valoresIniciales?.difficulty ?? null);
  const [prep, setPrep] = useState(valoresIniciales ? String(valoresIniciales.prepTimeMinutes) : '');
  const [coccion, setCoccion] = useState(valoresIniciales ? String(valoresIniciales.cookTimeMinutes) : '');
  const [porciones, setPorciones] = useState(valoresIniciales ? String(valoresIniciales.servings) : '');
  const [ingredientes, setIngredientes] = useState<string[]>(valoresIniciales?.ingredients ?? ['']);
  const [pasos, setPasos] = useState<string[]>(valoresIniciales?.instructions ?? ['']);

  const handleGuardar = () => {
    if (dificultad === null) {
      return;
    }
    onGuardar({
      name: nombre.trim(),
      cuisine: cocina.trim(),
      difficulty: dificultad,
      prepTimeMinutes: Number(prep),
      cookTimeMinutes: Number(coccion),
      servings: Number(porciones),
      ingredients: ingredientes.map((item) => item.trim()),
      instructions: pasos.map((item) => item.trim()),
    });
  };

  return (
    <ScrollView style={styles.pantalla} contentContainerStyle={styles.contenido} keyboardShouldPersistTaps="handled">
      <CampoFormulario
        etiqueta="Nombre"
        valor={nombre}
        onCambiarTexto={setNombre}
        placeholder="Ej: Tarta de manzana"
      />
      <CampoFormulario
        etiqueta="Cocina"
        valor={cocina}
        onCambiarTexto={setCocina}
        placeholder="Ej: Italiana"
      />

      <View style={styles.grupo}>
        <Text style={styles.etiqueta}>Dificultad</Text>
        <View style={styles.opciones}>
          {OPCIONES_DIFICULTAD.map((opcion) => {
            const seleccionada = dificultad === opcion;
            return (
              <Pressable
                key={opcion}
                style={[styles.opcion, seleccionada ? styles.opcionSeleccionada : null]}
                onPress={() => setDificultad(opcion)}
              >
                <Text style={[styles.textoOpcion, seleccionada ? styles.textoOpcionSeleccionada : null]}>
                  {traducirDificultad(opcion)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <CampoFormulario
        etiqueta="Preparación (minutos)"
        valor={prep}
        onCambiarTexto={setPrep}
        placeholder="Ej: 15"
        numerico
      />
      <CampoFormulario
        etiqueta="Cocción (minutos)"
        valor={coccion}
        onCambiarTexto={setCoccion}
        placeholder="Ej: 30"
        numerico
      />
      <CampoFormulario
        etiqueta="Porciones"
        valor={porciones}
        onCambiarTexto={setPorciones}
        placeholder="Ej: 4"
        numerico
      />

      <ListaEditable
        titulo="Ingredientes"
        items={ingredientes}
        onChange={setIngredientes}
        placeholder="Ej: 2 huevos"
        textoAgregar="Agregar ingrediente"
      />
      <ListaEditable
        titulo="Pasos"
        items={pasos}
        onChange={setPasos}
        placeholder="Ej: Mezclar todo en un bol"
        textoAgregar="Agregar paso"
        numerada
        multilinea
      />

      <Pressable style={styles.botonGuardar} onPress={handleGuardar}>
        <Text style={styles.textoBotonGuardar}>{textoBoton}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: Colores.fondo },
  contenido: { padding: 16, gap: 16, paddingBottom: 40 },
  grupo: { gap: 6 },
  etiqueta: { fontSize: 14, fontWeight: 'bold', color: Colores.texto },
  opciones: { flexDirection: 'row', gap: 8 },
  opcion: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colores.borde,
    backgroundColor: Colores.tarjeta,
  },
  opcionSeleccionada: { backgroundColor: Colores.primario, borderColor: Colores.primario },
  textoOpcion: { fontSize: 15, color: Colores.texto },
  textoOpcionSeleccionada: { color: Colores.textoSobrePrimario, fontWeight: 'bold' },
  botonGuardar: {
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: Colores.primario,
  },
  textoBotonGuardar: { fontSize: 16, fontWeight: 'bold', color: Colores.textoSobrePrimario },
});

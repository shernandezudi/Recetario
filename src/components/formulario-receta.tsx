import { useState } from 'react';
import { Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import CampoFormulario from './campo-formulario';
import { Colores } from '../constants/colores';
import { DatosReceta } from '../types/receta';

// Formulario unico para ALTA y EDICION.
// No llama a servicios ni al contexto: valida y le entrega los datos a quien lo usa (onGuardar).
type Props = {
  valoresIniciales?: DatosReceta;
  textoBoton: string;
  onGuardar: (datos: DatosReceta) => void;
};

// ---------- Componente ----------

export default function FormularioReceta({ valoresIniciales, textoBoton, onGuardar }: Props) {
  // El valor inicial de useState se usa una sola vez: asi se precarga la edicion.
  const [nombre, setNombre] = useState(valoresIniciales?.name ?? '');
  const [cocina, setCocina] = useState(valoresIniciales?.cuisine ?? '');
  const [prep, setPrep] = useState(valoresIniciales ? String(valoresIniciales.prepTimeMinutes) : '');
  const [coccion, setCoccion] = useState(valoresIniciales ? String(valoresIniciales.cookTimeMinutes) : '');
  const [porciones, setPorciones] = useState(valoresIniciales ? String(valoresIniciales.servings) : '');

  const handleGuardar = () => {
    onGuardar({
      name: nombre.trim(),
      cuisine: cocina.trim(),
      // Valores provisorios: se reemplazan en los commits siguientes
      difficulty: 'Easy',
      prepTimeMinutes: Number(prep),
      cookTimeMinutes: Number(coccion),
      servings: Number(porciones),
      ingredients: ['x'],
      instructions: ['x'],
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

      <Pressable style={styles.botonGuardar} onPress={handleGuardar}>
        <Text style={styles.textoBotonGuardar}>{textoBoton}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: Colores.fondo },
  contenido: { padding: 16, gap: 16, paddingBottom: 40 },
  botonGuardar: {
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: Colores.primario,
  },
  textoBotonGuardar: { fontSize: 16, fontWeight: 'bold', color: Colores.textoSobrePrimario },
});

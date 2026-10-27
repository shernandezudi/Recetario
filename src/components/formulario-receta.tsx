import { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import CampoFormulario from './campo-formulario';
import ListaEditable from './lista-editable';
import { Colores } from '../constants/colores';
import { DatosReceta, Dificultad } from '../../types/receta';
import { traducirDificultad } from '../../utils/formato';

// Formulario unico para ALTA y EDICION.
// No llama a servicios ni al contexto: valida y le entrega los datos a quien lo usa (onGuardar).
type Props = {
  valoresIniciales?: DatosReceta;
  textoBoton: string;
  enviando: boolean;
  errorEnvio?: string | null;
  onGuardar: (datos: DatosReceta) => void;
};

// Lo que el usuario va escribiendo. Los numeros se guardan como texto hasta validarlos.
type Borrador = {
  nombre: string;
  cocina: string;
  dificultad: Dificultad | null;
  prep: string;
  coccion: string;
  porciones: string;
  ingredientes: string[];
  pasos: string[];
};

type Errores = {
  nombre?: string;
  cocina?: string;
  dificultad?: string;
  prep?: string;
  coccion?: string;
  porciones?: string;
  ingredientes?: string;
  pasos?: string;
};

const OPCIONES_DIFICULTAD: Dificultad[] = ['Easy', 'Medium', 'Hard'];
const MINIMO_TEXTO = 3;

// ---------- Validaciones (funciones comunes, sin hooks) ----------

const validarTexto = (texto: string, etiqueta: string): string | undefined => {
  const limpio = texto.trim();
  if (limpio === '') return `${etiqueta} es obligatorio`;
  if (limpio.length < MINIMO_TEXTO) return `${etiqueta} debe tener al menos ${MINIMO_TEXTO} caracteres`;
  return undefined;
};

const validarNumero = (texto: string, etiqueta: string, minimo: number): string | undefined => {
  const limpio = texto.trim();
  if (limpio === '') return `${etiqueta} es obligatorio`;
  const numero = Number(limpio);
  if (Number.isNaN(numero)) return 'Ingresá un número válido';
  if (!Number.isInteger(numero)) return 'Ingresá un número entero';
  if (numero < minimo) return minimo === 0 ? 'No puede ser negativo' : `Debe ser al menos ${minimo}`;
  return undefined;
};

const validarLista = (items: string[], nombre: string): string | undefined => {
  if (items.length === 0) return `Agregá al menos un ${nombre}`;
  if (items.some((item) => item.trim() === '')) return 'Completá o quitá las filas vacías';
  return undefined;
};

const validar = (borrador: Borrador): Errores => {
  return {
    nombre: validarTexto(borrador.nombre, 'El nombre'),
    cocina: validarTexto(borrador.cocina, 'La cocina'),
    dificultad: borrador.dificultad === null ? 'Elegí una dificultad' : undefined,
    prep: validarNumero(borrador.prep, 'El tiempo de preparación', 0),
    coccion: validarNumero(borrador.coccion, 'El tiempo de cocción', 0),
    porciones: validarNumero(borrador.porciones, 'Las porciones', 1),
    ingredientes: validarLista(borrador.ingredientes, 'ingrediente'),
    pasos: validarLista(borrador.pasos, 'paso'),
  };
};

const hayErrores = (errores: Errores): boolean => {
  return Object.values(errores).some((error) => error !== undefined);
};

// ---------- Componente ----------

export default function FormularioReceta({ valoresIniciales, textoBoton, enviando, errorEnvio, onGuardar }: Props) {
  // El valor inicial de useState se usa una sola vez: asi se precarga la edicion.
  const [nombre, setNombre] = useState(valoresIniciales?.name ?? '');
  const [cocina, setCocina] = useState(valoresIniciales?.cuisine ?? '');
  const [dificultad, setDificultad] = useState<Dificultad | null>(valoresIniciales?.difficulty ?? null);
  const [prep, setPrep] = useState(valoresIniciales ? String(valoresIniciales.prepTimeMinutes) : '');
  const [coccion, setCoccion] = useState(valoresIniciales ? String(valoresIniciales.cookTimeMinutes) : '');
  const [porciones, setPorciones] = useState(valoresIniciales ? String(valoresIniciales.servings) : '');
  const [ingredientes, setIngredientes] = useState<string[]>(valoresIniciales?.ingredients ?? ['']);
  const [pasos, setPasos] = useState<string[]>(valoresIniciales?.instructions ?? ['']);
  const [intentoGuardar, setIntentoGuardar] = useState(false);

  const borrador: Borrador = { nombre, cocina, dificultad, prep, coccion, porciones, ingredientes, pasos };
  // Los errores se calculan a partir de lo escrito: no hace falta guardarlos en el estado.
  // Recien se muestran despues de apretar Guardar la primera vez.
  const errores: Errores = intentoGuardar ? validar(borrador) : {};

  const handleGuardar = () => {
    setIntentoGuardar(true);
    if (hayErrores(validar(borrador)) || dificultad === null) {
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
        error={errores.nombre}
      />
      <CampoFormulario
        etiqueta="Cocina"
        valor={cocina}
        onCambiarTexto={setCocina}
        placeholder="Ej: Italiana"
        error={errores.cocina}
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
        {errores.dificultad ? <Text style={styles.textoError}>{errores.dificultad}</Text> : null}
      </View>

      <CampoFormulario
        etiqueta="Preparación (minutos)"
        valor={prep}
        onCambiarTexto={setPrep}
        placeholder="Ej: 15"
        numerico
        error={errores.prep}
      />
      <CampoFormulario
        etiqueta="Cocción (minutos)"
        valor={coccion}
        onCambiarTexto={setCoccion}
        placeholder="Ej: 30"
        numerico
        error={errores.coccion}
      />
      <CampoFormulario
        etiqueta="Porciones"
        valor={porciones}
        onCambiarTexto={setPorciones}
        placeholder="Ej: 4"
        numerico
        error={errores.porciones}
      />

      <ListaEditable
        titulo="Ingredientes"
        items={ingredientes}
        onChange={setIngredientes}
        placeholder="Ej: 2 huevos"
        textoAgregar="Agregar ingrediente"
        error={errores.ingredientes}
        marcarVacias={intentoGuardar}
      />
      <ListaEditable
        titulo="Pasos"
        items={pasos}
        onChange={setPasos}
        placeholder="Ej: Mezclar todo en un bol"
        textoAgregar="Agregar paso"
        numerada
        multilinea
        error={errores.pasos}
        marcarVacias={intentoGuardar}
      />

      {errorEnvio ? <Text style={styles.errorEnvio}>{errorEnvio}</Text> : null}

      <Pressable
        style={[styles.botonGuardar, enviando ? styles.botonDeshabilitado : null]}
        onPress={handleGuardar}
        disabled={enviando}
      >
        <Text style={styles.textoBotonGuardar}>{enviando ? 'Guardando...' : textoBoton}</Text>
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
  textoError: { fontSize: 13, color: Colores.error },
  errorEnvio: {
    padding: 12,
    borderRadius: 8,
    fontSize: 14,
    color: Colores.error,
    backgroundColor: Colores.errorFondo,
  },
  botonGuardar: {
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: Colores.primario,
  },
  botonDeshabilitado: { backgroundColor: Colores.deshabilitado },
  textoBotonGuardar: { fontSize: 16, fontWeight: 'bold', color: Colores.textoSobrePrimario },
});

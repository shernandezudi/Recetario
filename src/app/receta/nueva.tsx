import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';
import { crearReceta } from '../../../services/recetas';
import { DatosReceta } from '../../../types/receta';
import FormularioReceta from '../../components/formulario-receta';
import { useRecetas } from '../../context/recetas-context';

export default function NuevaRecetaScreen() {
  const router = useRouter();
  const { agregarReceta } = useRecetas();
  const [enviando, setEnviando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState<string | null>(null);

  const handleGuardar = async (datos: DatosReceta) => {
    setEnviando(true);
    setErrorEnvio(null);
    try {
      const datosCompletos = {
        ...datos,
        caloriesPerServing: 0,
        tags: [],
        mealType: [],
        image: '',
      };

      const creada = await crearReceta(datosCompletos);
      // La API simula la creación; la receta queda en el contexto durante la sesión.
      agregarReceta(creada);
      Alert.alert('Receta creada', `"${datos.name}" se agregó a tu recetario.`, [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (e) {
      const detalle = e instanceof Error ? e.message : 'error desconocido';
      setErrorEnvio(`No se pudo crear la receta (${detalle}). Revisá tu conexión y volvé a tocar Guardar.`);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <FormularioReceta
      textoBoton="Crear receta"
      enviando={enviando}
      errorEnvio={errorEnvio}
      onGuardar={handleGuardar}
    />
  );
}

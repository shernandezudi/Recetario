import { useEffect, useState } from 'react';
import { useRecetas } from '../context/recetas-context';
import { obtenerReceta } from '../../services/recetas';
import { Receta } from '../../types/receta';

// Hook propio: es solo una funcion que agrupa useState + useEffect para no repetir
// el mismo codigo en el detalle y en la edicion.
// Busca la receta primero en el contexto (ahi viven las creadas y editadas en la sesion)
// y solo si no esta la pide al servidor.
type Resultado = {
  receta: Receta | null;
  cargando: boolean;
  error: string | null;
  reintentar: () => void;
};

export default function useReceta(id: number): Resultado {
  const { obtenerRecetaLocal, esDeSesion, fueEliminada } = useRecetas();
  const recetaLocal = obtenerRecetaLocal(id);
  const idValido = !Number.isNaN(id);
  // Una receta de sesion NUNCA se pide a la API: no existe en el servidor (daria 404)
  const necesitaServidor = idValido && recetaLocal === undefined && !esDeSesion(id) && !fueEliminada(id);

  const [recetaRemota, setRecetaRemota] = useState<Receta | null>(null);
  const [cargando, setCargando] = useState(necesitaServidor);
  const [error, setError] = useState<string | null>(idValido ? null : 'La receta que buscás no es válida.');

  const cargarDesdeServidor = async () => {
    setCargando(true);
    setError(null);
    try {
      const receta = await obtenerReceta(id);
      setRecetaRemota(receta);
    } catch (e) {
      const detalle = e instanceof Error ? e.message : 'error desconocido';
      setError(`No se pudo cargar la receta (${detalle}).`);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (necesitaServidor) {
      cargarDesdeServidor();
    }
  }, [id]);

  const reintentar = () => {
    if (idValido) {
      cargarDesdeServidor();
    }
  };

  return { receta: recetaLocal ?? recetaRemota, cargando, error, reintentar };
}

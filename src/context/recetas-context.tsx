
import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import {
  actualizarReceta as actualizarRecetaAPI,
  buscarRecetas,
  eliminarReceta as eliminarRecetaAPI,
  obtenerRecetas,
} from '../../services/recetas';

import type {
  ActualizarReceta,
  NuevaReceta,
  Receta,
} from '../../types/receta';

interface RecetasContextoType {
  recetas: Receta[];
  cargando: boolean;
  error: string;
  cargarRecetas: () => Promise<void>;
  agregarReceta: (datos: NuevaReceta) => Promise<Receta>;
  editarReceta: (id: number, datos: ActualizarReceta) => Promise<void>;
  borrarReceta: (id: number) => Promise<void>;
  buscarRecetasEnContexto: (consulta: string) => Promise<void>;

  obtenerRecetaLocal: (id: number) => Receta | undefined;
  esDeSesion: (id: number) => boolean;
  fueEliminada: (id: number) => boolean;
  quitarReceta: (id: number) => void;
  reemplazarReceta: (receta: Receta) => void;
}

const RecetasContexto = createContext<RecetasContextoType | undefined>(
  undefined
);

interface ProveedorRecetasProps {
  children: ReactNode;
}

export function ProveedorRecetas({ children }: ProveedorRecetasProps) {
  const [recetas, setRecetas] = useState<Receta[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const siguienteIdLocal = useRef(-1);
  const idsEliminados = useRef<Set<number>>(new Set());

  const obtenerRecetaLocal = (id: number): Receta | undefined =>
    recetas.find((receta) => receta.id === id);

  const esDeSesion = (id: number): boolean => id < 0;

  const fueEliminada = (id: number): boolean =>
    idsEliminados.current.has(id);

  const quitarReceta = (id: number): void => {
    idsEliminados.current.add(id);
    setRecetas((actuales) =>
      actuales.filter((receta) => receta.id !== id)
    );
  };

  const reemplazarReceta = (receta: Receta): void => {
    setRecetas((actuales) => {
      const existe = actuales.some((item) => item.id === receta.id);

      return existe
        ? actuales.map((item) =>
            item.id === receta.id ? receta : item
          )
        : [receta, ...actuales];
    });
  };

  const cargarRecetas = useCallback(async (): Promise<void> => {
    try {
      setCargando(true);
      setError('');

      const respuesta = await obtenerRecetas();

      setRecetas((actuales) => {
        const recetasLocales = actuales.filter(
          (receta) => receta.id < 0
        );
        const recetasRemotas = respuesta.recipes.filter(
          (receta) => !idsEliminados.current.has(receta.id)
        );

        return [...recetasLocales, ...recetasRemotas];
      });
    } catch {
      setError('No se pudieron cargar las recetas.');
      throw new Error('No se pudieron cargar las recetas.');
    } finally {
      setCargando(false);
    }
  }, []);

  const buscarRecetasEnContexto = async (
    consulta: string
  ): Promise<void> => {
    try {
      setCargando(true);
      setError('');

      if (!consulta.trim()) {
        await cargarRecetas();
        return;
      }

      const respuesta = await buscarRecetas(consulta);
      const texto = consulta.trim().toLowerCase();

      setRecetas((actuales) => {
        const recetasLocales = actuales.filter(
          (receta) =>
            receta.id < 0 &&
            receta.name.toLowerCase().includes(texto)
        );

        const recetasRemotas = respuesta.recipes.filter(
          (receta) => !idsEliminados.current.has(receta.id)
        );

        return [...recetasLocales, ...recetasRemotas];
      });
    } catch {
      setError('No se pudieron buscar las recetas. Intentá nuevamente.');
      throw new Error('No se pudieron buscar las recetas.');
    } finally {
      setCargando(false);
    }
  };

  // La pantalla ya llama a crearReceta; acá solo la guardamos localmente.
  const agregarReceta = async (
    datos: NuevaReceta
  ): Promise<Receta> => {
    const nueva: Receta = {
      ...datos,
      id: siguienteIdLocal.current,
      rating: 0,
    };

    siguienteIdLocal.current -= 1;
    idsEliminados.current.delete(nueva.id);
    setRecetas((actuales) => [nueva, ...actuales]);

    return nueva;
  };

  const editarReceta = async (
    id: number,
    datos: ActualizarReceta
  ): Promise<void> => {
    if (id >= 0) {
      const actualizada = await actualizarRecetaAPI(id, datos);

      setRecetas((actuales) =>
        actuales.map((receta) =>
          receta.id === id ? { ...receta, ...actualizada } : receta
        )
      );
      return;
    }

    setRecetas((actuales) =>
      actuales.map((receta) =>
        receta.id === id ? { ...receta, ...datos } : receta
      )
    );
  };

  const borrarReceta = async (id: number): Promise<void> => {
    if (id >= 0) {
      await eliminarRecetaAPI(id);
    }

    quitarReceta(id);
  };

  return (
    <RecetasContexto.Provider
      value={{
        recetas,
        cargando,
        error,
        cargarRecetas,
        buscarRecetasEnContexto,
        agregarReceta,
        editarReceta,
        borrarReceta,
        obtenerRecetaLocal,
        esDeSesion,
        fueEliminada,
        quitarReceta,
        reemplazarReceta,
      }}
    >
      {children}
    </RecetasContexto.Provider>
  );
}

export function useRecetas() {
  const contexto = useContext(RecetasContexto);

  if (!contexto) {
    throw new Error(
      'useRecetas debe utilizarse dentro de ProveedorRecetas.'
    );
  }

  return contexto;
}

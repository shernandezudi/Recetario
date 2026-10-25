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
    crearReceta as crearRecetaAPI,
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
}

const RecetasContexto = createContext<RecetasContextoType | undefined>(
  undefined
);

interface ProveedorRecetasProps {
  children: ReactNode;
}

export function ProveedorRecetas({
  children,
}: ProveedorRecetasProps) {
  const [recetas, setRecetas] = useState<Receta[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const siguienteIdLocal = useRef(-1);

    async function buscarRecetasEnContexto(
    consulta: string
    ): Promise<void> {
    try {
        setCargando(true);
        setError('');

        if (!consulta.trim()) {
        await cargarRecetas();
        return;
        }

        const respuesta = await buscarRecetas(consulta);

        setRecetas((actuales) => {
        const recetasLocales = actuales.filter(
            (receta) =>
            receta.id < 0 &&
            receta.name.toLowerCase().includes(consulta.trim().toLowerCase())
        );

        return [...recetasLocales, ...respuesta.recipes];
        });
    } catch {
        setError('No se pudieron buscar las recetas. Intentá nuevamente.');
        throw new Error('No se pudieron buscar las recetas.');
    } finally {
        setCargando(false);
    }
    }

  async function agregarReceta(datos: NuevaReceta): Promise<Receta> {
    const respuestaAPI = await crearRecetaAPI(datos);

    // Asignamos un ID local negativo para identificarla durante la sesión.
    const nueva: Receta = {
        ...respuestaAPI,
        ...datos,
        id: siguienteIdLocal.current,
    };

    siguienteIdLocal.current -= 1;

    setRecetas((actuales) => [nueva, ...actuales]);

    return nueva;
    }

    async function editarReceta(
    id: number,
    datos: ActualizarReceta
    ): Promise<void> {
    if (id < 0) {
        setRecetas((actuales) =>
        actuales.map((receta) =>
            receta.id === id ? { ...receta, ...datos } : receta
        )
        );
        return;
    }

    const actualizada = await actualizarRecetaAPI(id, datos);

    setRecetas((actuales) =>
        actuales.map((receta) =>
        receta.id === id ? { ...receta, ...actualizada } : receta
        )
    );
    }


    async function borrarReceta(id: number): Promise<void> {
    if (id < 0) {
        setRecetas((actuales) =>
        actuales.filter((receta) => receta.id !== id)
        );
        return;
    }

    await eliminarRecetaAPI(id);

    setRecetas((actuales) =>
        actuales.filter((receta) => receta.id !== id)
    );
    }


    const cargarRecetas = useCallback(async () => {
    try {
        setCargando(true);
        setError('');

        const respuesta = await obtenerRecetas();

        setRecetas((actuales) => {
        const recetasLocales = actuales.filter((receta) => receta.id < 0);

        return [...recetasLocales, ...respuesta.recipes];
        });
    } catch {
        setError('No se pudieron cargar las recetas.');
        throw new Error('No se pudieron cargar las recetas.');
    } finally {
        setCargando(false);
    }
    }, []);

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

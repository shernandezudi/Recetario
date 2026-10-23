
import type {
    ActualizarReceta,
    NuevaReceta,
    Receta,
    RespuestaRecetas,
} from '../types/receta';

const API_URL = 'https://dummyjson.com';

async function solicitar<T>(
  ruta: string,
  opciones?: RequestInit
): Promise<T> {
  const respuesta = await fetch(`${API_URL}${ruta}`, {
    ...opciones,
    headers: {
      'Content-Type': 'application/json',
      ...opciones?.headers,
    },
  });

  if (!respuesta.ok) {
    throw new Error(
      `Error al consultar la API: ${respuesta.status} ${respuesta.statusText}`
    );
  }

  return (await respuesta.json()) as T;
}

/** Obtiene una página de recetas. */
export function obtenerRecetas(
  limit = 10,
  skip = 0
): Promise<RespuestaRecetas> {
  return solicitar<RespuestaRecetas>(
    `/recipes?limit=${limit}&skip=${skip}`
  );
}

/** Busca recetas por nombre u otros campos compatibles con la búsqueda de DummyJSON. */
export function buscarRecetas(
  consulta: string
): Promise<RespuestaRecetas> {
  const q = encodeURIComponent(consulta.trim());

  return solicitar<RespuestaRecetas>(`/recipes/search?q=${q}`);
}

/** Obtiene una receta por su ID. */
export function obtenerRecetaPorId(id: number): Promise<Receta> {
  return solicitar<Receta>(`/recipes/${id}`);
}

/** Obtiene las etiquetas disponibles. */
export function obtenerEtiquetas(): Promise<string[]> {
  return solicitar<string[]>('/recipes/tags');
}

/** Obtiene las recetas asociadas a una etiqueta. */
export function obtenerRecetasPorEtiqueta(
  etiqueta: string
): Promise<RespuestaRecetas> {
  return solicitar<RespuestaRecetas>(
    `/recipes/tag/${encodeURIComponent(etiqueta)}`
  );
}

/** Simula la creación de una receta en DummyJSON. */
export function crearReceta(datos: NuevaReceta): Promise<Receta> {
  return solicitar<Receta>('/recipes/add', {
    method: 'POST',
    body: JSON.stringify(datos),
  });
}

/** Simula la actualización de una receta en DummyJSON. */
export function actualizarReceta(
  id: number,
  datos: ActualizarReceta
): Promise<Receta> {
  return solicitar<Receta>(`/recipes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(datos),
  });
}

/** Simula la eliminación de una receta en DummyJSON. */
export interface ResultadoEliminarReceta {
  id: number;
  isDeleted: boolean;
  deletedOn: string;
}

export function eliminarReceta(
  id: number
): Promise<ResultadoEliminarReceta> {
  return solicitar<ResultadoEliminarReceta>(`/recipes/${id}`, {
    method: 'DELETE',
  });
}

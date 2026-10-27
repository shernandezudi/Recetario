// exporta la dificultad de la receta
export type Dificultad = 'Easy' | 'Medium' | 'Hard';
export type DatosReceta = Pick<
  NuevaReceta,
  | 'name'
  | 'cuisine'
  | 'difficulty'
  | 'prepTimeMinutes'
  | 'cookTimeMinutes'
  | 'servings'
  | 'ingredients'
  | 'instructions'
>;

//Receta: describe una receta completa recibida desde la API.
export interface Receta {
  id: number;
  name: string;
  ingredients: string[];
  instructions: string[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: Dificultad;
  cuisine: string;
  caloriesPerServing: number;
  tags: string[];
  mealType: string[];
  image: string;
  rating: number;
}

//RespuestaRecetas: representa la respuesta paginada de DummyJSON.
export interface RespuestaRecetas {
  recipes: Receta[];
  total: number;
  skip: number;
  limit: number;
}

//NuevaReceta: define los datos necesarios para crear una receta, sin exigir un ID ni una calificación.
export interface NuevaReceta {
  name: string;
  ingredients: string[];
  instructions: string[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: Dificultad;
  cuisine: string;
  caloriesPerServing: number;
  tags: string[];
  mealType: string[];
  image: string;
}

//- ActualizarReceta: permite modificar solamente algunos campos de una receta.
export type ActualizarReceta = Partial<NuevaReceta>;

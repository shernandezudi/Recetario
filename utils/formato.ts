
import type { Dificultad, Receta } from '../types/receta';

export const tiempoTotal = calcularTiempoTotal;

/**
 * Calcula el tiempo total de preparación y cocción de una receta.
 */
export function calcularTiempoTotal(receta: Pick<Receta, 'prepTimeMinutes' | 'cookTimeMinutes'>): number {
  return receta.prepTimeMinutes + receta.cookTimeMinutes;
}

/**
 * Traduce la dificultad de la receta al castellano.
 */
export function traducirDificultad(dificultad: Dificultad): string {
  switch (dificultad) {
    case 'Easy':
      return 'Fácil';
    case 'Medium':
      return 'Media';
    case 'Hard':
      return 'Difícil';
  }
}

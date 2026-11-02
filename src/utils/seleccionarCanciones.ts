import type { Cancion } from '../types/cancion';

export function seleccionarCanciones(canciones: Cancion[]): Cancion[] {
    const cancionesMezcladas = [...canciones];

    cancionesMezcladas.sort(() => Math.random() - 0.5);

    return cancionesMezcladas.slice(0, 10);
}

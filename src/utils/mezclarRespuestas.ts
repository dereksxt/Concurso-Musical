export function mezclarRespuestas(respuestas: string[]): string[] {
    // Creamos una copia para no modificar el array original.
    const respuestasMezcladas = [...respuestas];

    // Recorremos el array desde la última posición hasta la primera.
    for (let i = respuestasMezcladas.length - 1; i > 0; i--) {

        // Generamos un índice aleatorio.
        const indiceAleatorio = Math.floor(Math.random() * (i + 1));

        // Guardamos las dos respuestas que vamos a intercambiar.
        const respuestaActual = respuestasMezcladas[i]!;
        const respuestaAleatoria = respuestasMezcladas[indiceAleatorio]!;

        // Intercambiamos sus posiciones.
        respuestasMezcladas[i] = respuestaAleatoria;
        respuestasMezcladas[indiceAleatorio] = respuestaActual;
    }

    // Devolvemos el array mezclado.
    return respuestasMezcladas;
}

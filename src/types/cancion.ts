export interface Cancion {
    id: number,
    titulo: string,
    artista: string,
    duracion: number,
    respuestas: string[],
    respuestaCorrecta: string;
    audio: string;
}
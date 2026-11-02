
import { defineStore } from 'pinia';
import type { Cancion } from '../types/cancion';
import { canciones } from '../data/canciones';
import { seleccionarCanciones } from '../utils/seleccionarCanciones';

export const usePartidaStore = defineStore('partida', {
    state: () => ({
        nombreJugador: sessionStorage.getItem('nombreJugador') ?? 'Jugador',
        cancionesPartida: [] as Cancion[],
        indiceActual: 0,
        puntuacion: 0,
        respuestasCorrectas: 0,
        partidaFinalizada: false,
        tiempoInicio: 0,
        tiempoTotal: 0,
        // evitar que una misma partida se guarde varias veces en Supabase
        resultadoGuardado: false,
    }),

    actions: {
        iniciarPartida() {
            this.nombreJugador = sessionStorage.getItem('nombreJugador') ?? 'Jugador';
            this.cancionesPartida = seleccionarCanciones(canciones);
            this.indiceActual = 0;
            this.puntuacion = 0;
            this.respuestasCorrectas = 0;
            this.partidaFinalizada = false;
            this.tiempoInicio = Date.now();
            this.tiempoTotal = 0;
            this.resultadoGuardado = false;
        },

        responderPregunta(respuestaSeleccionada: string) {
            const cancionActual = this.cancionesPartida[this.indiceActual];

            if (!cancionActual) return;

            if (respuestaSeleccionada === cancionActual.respuestaCorrecta) {
                this.puntuacion += 10;
                this.respuestasCorrectas++;
            } else {
                this.puntuacion -= 5;
            }
        },

        siguientePregunta() {
            if (this.indiceActual < this.cancionesPartida.length - 1) {
                this.indiceActual++;
            } else {
                this.partidaFinalizada = true;
                this.tiempoTotal = Math.round(
                    (Date.now() - this.tiempoInicio) / 1000
                );
            }
        }
    }
});

<script setup lang="ts">
import { computed, ref, watch, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { usePartidaStore } from '../stores/partida';
import { mezclarRespuestas } from '../utils/mezclarRespuestas';
import { reproducirFragmento, detenerAudio } from '../services/audioService';

const partidaStore = usePartidaStore();
const router = useRouter();

partidaStore.iniciarPartida();

// Obtenemos la canción actual de forma reactiva.
const cancionActual = computed(() => {
    return partidaStore.cancionesPartida[partidaStore.indiceActual];
});

// Mezclamos las respuestas.
const respuestasMezcladas = computed(() => {
    if (!cancionActual.value) return [];

    return mezclarRespuestas(cancionActual.value.respuestas);
});

// Estados de la pregunta.
const respuestaSeleccionada = ref<string | null>(null);
const preguntaRespondida = ref(false);
const tiempoAgotado = ref(false);
const tiempoRestante = ref(5);

// Controlamos el intervalo del temporizador.
let intervaloTemporizador: ReturnType<typeof setInterval> | null = null;

// Detenemos el temporizador.
function detenerTemporizador() {
    if (intervaloTemporizador !== null) {
        clearInterval(intervaloTemporizador);
        intervaloTemporizador = null;
    }
}

// Iniciamos el temporizador de cinco segundos.
function iniciarTemporizador() {
    detenerTemporizador();
    detenerAudio();

    if (partidaStore.partidaFinalizada || !cancionActual.value) {
        return;
    }

    tiempoRestante.value = 5;

    // Reproducimos un fragmento aleatorio de la canción actual.
    reproducirFragmento(cancionActual.value.audio);

    intervaloTemporizador = setInterval(() => {
        tiempoRestante.value--;

        if (tiempoRestante.value <= 0) {
            agotarTiempo();
        }
    }, 1000);
}

// Cuando se acaba el tiempo.
function agotarTiempo() {
    detenerTemporizador();
    detenerAudio();

    tiempoAgotado.value = true;
    preguntaRespondida.value = true;
}

// Comprobamos la respuesta del jugador.
function seleccionarRespuesta(respuesta: string) {
    if (preguntaRespondida.value || !cancionActual.value) {
        return;
    }

    detenerTemporizador();
    detenerAudio();

    respuestaSeleccionada.value = respuesta;
    preguntaRespondida.value = true;

    partidaStore.responderPregunta(respuesta);
}

// Pasamos a la siguiente pregunta.
function siguientePregunta() {
    respuestaSeleccionada.value = null;
    preguntaRespondida.value = false;
    tiempoAgotado.value = false;

    detenerTemporizador();
    detenerAudio();

    partidaStore.siguientePregunta();

    // Si hemos terminado las 10 preguntas, vamos a resultados.
    if (partidaStore.partidaFinalizada) {
        router.push('/resultado');
    }
}

// Determinamos el color de las respuestas.
function obtenerClaseRespuesta(respuesta: string) {
    if (!preguntaRespondida.value || !cancionActual.value) {
        return '';
    }

    if (respuesta === cancionActual.value.respuestaCorrecta) {
        return 'correcta';
    }

    if (respuesta === respuestaSeleccionada.value) {
        return 'incorrecta';
    }

    return '';
}

// Reiniciamos el temporizador cuando cambia la pregunta.
watch(
    () => partidaStore.indiceActual,
    () => {
        iniciarTemporizador();
    },
    { immediate: true }
);

// Limpiamos los recursos al salir de la vista.
onUnmounted(() => {
    detenerTemporizador();
    detenerAudio();
});
</script>

<template>
    <section class="concurso">
        <div class="concurso-cabecera">
            <div class="etiqueta">
                <span class="punto"></span>
                CONCURSO MUSICAL
            </div>

            <h2>¡A jugar, <span>{{ partidaStore.nombreJugador }}</span>!</h2>

            <p>Prepárate para demostrar cuánto sabes de música.</p>
        </div>

        <div class="estado-partida">
            <div class="estado-tarjeta">
                <div class="estado-icono">♫</div>

                <div class="estado-informacion">
                    <span>Ronda actual</span>
                    <strong>
                        {{ partidaStore.indiceActual + 1 }}
                        <small>/ {{ partidaStore.cancionesPartida.length }}</small>
                    </strong>
                </div>
            </div>

            <div class="estado-tarjeta">
                <div class="estado-icono puntuacion-icono">★</div>

                <div class="estado-informacion">
                    <span>Tu puntuación</span>
                    <strong>{{ partidaStore.puntuacion }} <small>puntos</small></strong>
                </div>
            </div>
        </div>

        <div class="progreso-contenedor">
            <div class="progreso-texto">
                <span>Progreso del concurso</span>
                <strong>
                    {{ partidaStore.indiceActual + 1 }} /
                    {{ partidaStore.cancionesPartida.length }}
                </strong>
            </div>

            <div class="progreso-barra">
                <div
                    class="progreso-relleno"
                    :style="{
                        width: `${((partidaStore.indiceActual + 1) / partidaStore.cancionesPartida.length) * 100}%`
                    }"
                ></div>
            </div>
        </div>

        <div
            v-if="!partidaStore.partidaFinalizada && cancionActual"
            class="pregunta"
        >
            <div class="pregunta-etiqueta">RETO MUSICAL</div>

            <h3>¿Qué canción estás escuchando?</h3>

            <p class="artista">{{ cancionActual.artista }}</p>

            <div class="temporizador" :class="{ 'tiempo-bajo': tiempoRestante <= 2 && !preguntaRespondida }">
                <div class="temporizador-circulo">
                    <span>{{ tiempoRestante }}</span>
                    <small>s</small>
                </div>

                <div class="temporizador-informacion">
                    <strong>Tiempo restante</strong>
                    <span>
                        {{ preguntaRespondida ? 'Ronda finalizada' : 'Escucha con atención' }}
                    </span>
                </div>
            </div>

            <div class="respuestas">
                <button
                    v-for="(respuesta, indice) in respuestasMezcladas"
                    :key="indice"
                    class="respuesta"
                    :class="obtenerClaseRespuesta(respuesta)"
                    :disabled="preguntaRespondida"
                    @click="seleccionarRespuesta(respuesta)"
                >
                    <span class="respuesta-letra">
                        {{ String.fromCharCode(65 + indice) }}
                    </span>

                    <span class="respuesta-texto">{{ respuesta }}</span>

                    <span
                        v-if="preguntaRespondida && respuesta === cancionActual.respuestaCorrecta"
                        class="respuesta-icono"
                    >
                        ✓
                    </span>

                    <span
                        v-else-if="preguntaRespondida && respuesta === respuestaSeleccionada"
                        class="respuesta-icono"
                    >
                        ✕
                    </span>
                </button>
            </div>

            <div v-if="preguntaRespondida" class="resultado">
                <p v-if="tiempoAgotado" class="mensaje-tiempo">
                    <span>⏱</span>
                    ¡Tiempo agotado! No has ganado ni perdido puntos.
                </p>

                <p
                    v-else-if="respuestaSeleccionada === cancionActual.respuestaCorrecta"
                    class="mensaje-acierto"
                >
                    <span>✓</span>
                    ¡Enhorabuena! Has acertado. +10 puntos
                </p>

                <p v-else class="mensaje-error">
                    <span>✕</span>
                    ¡Vaya! No has acertado. -5 puntos
                </p>

                <button class="boton-continuar" @click="siguientePregunta">
                    {{
                        partidaStore.indiceActual === partidaStore.cancionesPartida.length - 1
                            ? 'Ver resultado'
                            : 'Siguiente pregunta'
                    }}
                    <span>→</span>
                </button>
            </div>
        </div>

        <div v-else class="pregunta pregunta-finalizada">
            <div class="final-icono">♫</div>
            <h3>¡Partida finalizada!</h3>
            <p>Has conseguido {{ partidaStore.puntuacion }} puntos.</p>
        </div>
    </section>
</template>

<style scoped>
.concurso {
    width: 100%;
    max-width: 850px;
    margin: 0 auto;
    padding: 1rem 0 3rem;
}

.concurso-cabecera {
    text-align: center;
    margin-bottom: 2rem;
}

.etiqueta {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;

    margin-bottom: 1rem;
    padding: 0.45rem 0.9rem;

    color: #339c6e;
    background: #edf8f2;
    border: 1px solid #d5eee0;
    border-radius: 30px;

    font-size: 0.75rem;
    font-weight: 800;
    letter-spacing: 1px;
}

.punto {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #42b883;
}

.concurso h2 {
    margin: 0;
    color: #17352b;
    font-size: clamp(1.8rem, 5vw, 2.5rem);
    font-weight: 800;
    letter-spacing: -1px;
}

.concurso h2 span {
    color: #42b883;
}

.concurso-cabecera > p {
    margin: 0.7rem 0 0;
    color: #718078;
    font-size: 1rem;
}

.estado-partida {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1.5rem;
}

.estado-tarjeta {
    display: flex;
    align-items: center;
    gap: 1rem;

    padding: 1.2rem 1.4rem;

    background: #ffffff;
    border: 1px solid #e3ebe6;
    border-radius: 15px;
    box-shadow: 0 5px 18px rgba(35, 73, 54, 0.04);
}

.estado-icono {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 46px;
    height: 46px;
    flex-shrink: 0;

    color: #339c6e;
    background: #eaf7ef;
    border-radius: 12px;

    font-size: 1.6rem;
    font-weight: 700;
}

.puntuacion-icono {
    color: #a87919;
    background: #fff6df;
}

.estado-informacion {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
}

.estado-informacion > span {
    color: #849188;
    font-size: 0.85rem;
    font-weight: 600;
}

.estado-informacion strong {
    color: #17352b;
    font-size: 1.4rem;
    font-weight: 800;
}

.estado-informacion small {
    color: #849188;
    font-size: 0.85rem;
    font-weight: 500;
}

.progreso-contenedor {
    margin-bottom: 1.5rem;
    padding: 1.1rem 1.3rem;

    background: #ffffff;
    border: 1px solid #e3ebe6;
    border-radius: 13px;
}

.progreso-texto {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 0.7rem;

    color: #718078;
    font-size: 0.85rem;
    font-weight: 600;
}

.progreso-texto strong {
    color: #339c6e;
}

.progreso-barra {
    height: 9px;
    overflow: hidden;

    background: #eaf1ec;
    border-radius: 20px;
}

.progreso-relleno {
    height: 100%;
    background: linear-gradient(90deg, #245d43 0%, #42b883 100%);
    border-radius: 20px;
    transition: width 0.35s ease;
}

.pregunta {
    margin: 0 auto;
    padding: 2rem;

    text-align: center;
    background: #ffffff;
    border: 1px solid #e3ebe6;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(35, 73, 54, 0.06);
}

.pregunta-etiqueta {
    color: #42b883;
    font-size: 0.75rem;
    font-weight: 800;
    letter-spacing: 1.5px;
}

.pregunta h3 {
    margin: 0.7rem 0 0;
    color: #17352b;
    font-size: clamp(1.35rem, 4vw, 1.7rem);
    font-weight: 800;
}

.artista {
    margin: 0.6rem 0 0;
    color: #339c6e;
    font-size: 1rem;
    font-weight: 700;
}

.temporizador {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;

    width: fit-content;
    margin: 1.8rem auto;
    padding: 0.8rem 1.4rem;

    background: #f3faf6;
    border: 1px solid #dcefe3;
    border-radius: 15px;

    transition: all 0.25s ease;
}

.temporizador-circulo {
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 2px;

    width: 52px;
    height: 52px;
    padding-top: 13px;

    color: #ffffff;
    background: linear-gradient(135deg, #245d43, #42b883);
    border-radius: 50%;
    box-shadow: 0 4px 12px rgba(66, 184, 131, 0.2);
}

.temporizador-circulo span {
    font-size: 1.35rem;
    font-weight: 800;
}

.temporizador-circulo small {
    font-size: 0.7rem;
    font-weight: 600;
}

.temporizador-informacion {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    text-align: left;
}

.temporizador-informacion strong {
    color: #294438;
    font-size: 0.9rem;
}

.temporizador-informacion span {
    color: #849188;
    font-size: 0.8rem;
}

.temporizador.tiempo-bajo {
    background: #fff5f2;
    border-color: #f5d4ca;
}

.temporizador.tiempo-bajo .temporizador-circulo {
    background: linear-gradient(135deg, #c24136, #ef765e);
}

.respuestas {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-top: 2rem;
}

.respuesta {
    display: flex;
    align-items: center;
    gap: 0.9rem;

    min-height: 72px;
    padding: 1rem;

    color: #294438;
    background: #f7faf8;
    border: 1px solid #e1eae4;
    border-radius: 12px;

    font-family: inherit;
    font-size: 0.95rem;
    font-weight: 600;
    text-align: left;

    cursor: pointer;
    transition: all 0.2s ease;
}

.respuesta-letra {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 34px;
    height: 34px;
    flex-shrink: 0;

    color: #339c6e;
    background: #e5f4eb;
    border-radius: 9px;

    font-size: 0.9rem;
    font-weight: 800;
}

.respuesta-texto {
    flex: 1;
}

.respuesta:hover:not(:disabled) {
    background: #edf8f2;
    border-color: #42b883;
    transform: translateY(-2px);
    box-shadow: 0 5px 14px rgba(66, 184, 131, 0.1);
}

.respuesta:disabled {
    cursor: default;
    opacity: 1;
}

.respuesta.correcta {
    color: #166534;
    background: #e5f7eb;
    border-color: #42b883;
}

.respuesta.correcta .respuesta-letra {
    color: #ffffff;
    background: #339c6e;
}

.respuesta.incorrecta {
    color: #991b1b;
    background: #fff0ee;
    border-color: #e57373;
}

.respuesta.incorrecta .respuesta-letra {
    color: #ffffff;
    background: #dc6262;
}

.respuesta-icono {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 25px;
    height: 25px;
    flex-shrink: 0;

    border-radius: 50%;
    font-weight: 800;
}

.respuesta.correcta .respuesta-icono {
    color: #ffffff;
    background: #339c6e;
}

.respuesta.incorrecta .respuesta-icono {
    color: #ffffff;
    background: #dc6262;
}

.resultado {
    margin-top: 1.8rem;
    padding-top: 1.5rem;
    border-top: 1px solid #e8eee9;
}

.mensaje-acierto,
.mensaje-error,
.mensaje-tiempo {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;

    margin: 0;
    padding: 1rem;

    border-radius: 11px;
    font-size: 0.95rem;
    font-weight: 700;
}

.mensaje-acierto {
    color: #166534;
    background: #e8f7ed;
}

.mensaje-error {
    color: #991b1b;
    background: #fff0ee;
}

.mensaje-tiempo {
    color: #9a6413;
    background: #fff7e6;
}

.boton-continuar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.7rem;

    margin-top: 1.3rem;
    padding: 0.95rem 1.7rem;

    color: #ffffff;
    background: linear-gradient(120deg, #245d43 0%, #42b883 100%);
    border: none;
    border-radius: 10px;

    font-family: inherit;
    font-size: 0.95rem;
    font-weight: 700;

    cursor: pointer;
    box-shadow: 0 5px 14px rgba(66, 184, 131, 0.2);
    transition: all 0.2s ease;
}

.boton-continuar span {
    font-size: 1.2rem;
    transition: transform 0.2s ease;
}

.boton-continuar:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 18px rgba(66, 184, 131, 0.3);
}

.boton-continuar:hover span {
    transform: translateX(4px);
}

.pregunta-finalizada {
    padding: 3rem 2rem;
}

.final-icono {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 70px;
    height: 70px;
    margin: 0 auto 1rem;

    color: #339c6e;
    background: #eaf7ef;
    border-radius: 20px;

    font-size: 2rem;
}

.pregunta-finalizada p {
    color: #718078;
}

@media (max-width: 600px) {
    .concurso {
        padding-top: 0.5rem;
    }

    .estado-partida {
        gap: 0.7rem;
    }

    .estado-tarjeta {
        gap: 0.65rem;
        padding: 0.9rem 0.7rem;
    }

    .estado-icono {
        width: 38px;
        height: 38px;
        font-size: 1.3rem;
    }

    .estado-informacion strong {
        font-size: 1.15rem;
    }

    .estado-informacion > span {
        font-size: 0.75rem;
    }

    .pregunta {
        padding: 1.5rem 1rem;
    }

    .respuestas {
        grid-template-columns: 1fr;
        gap: 0.7rem;
    }

    .respuesta {
        min-height: 62px;
    }

    .mensaje-acierto,
    .mensaje-error,
    .mensaje-tiempo {
        font-size: 0.85rem;
    }

    .boton-continuar {
        width: 100%;
    }
}
</style>

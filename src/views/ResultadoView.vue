<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { usePartidaStore } from '../stores/partida';
import {
    guardarResultado,
    obtenerPosicionResultado
} from '../services/rankingService';

const partidaStore = usePartidaStore();

const guardandoResultado = ref(true);
const errorGuardado = ref(false);
const posicionFinal = ref<number | null>(null);

// Calculamos el número total de preguntas.
const totalPreguntas = computed(() => {
    return partidaStore.cancionesPartida.length;
});

// Calculamos el porcentaje de aciertos.
const porcentajeAciertos = computed(() => {
    if (totalPreguntas.value === 0) return 0;

    return Math.round(
        (partidaStore.respuestasCorrectas / totalPreguntas.value) * 100
    );
});

// Mensaje personalizado según el resultado.
const mensajeResultado = computed(() => {
    if (porcentajeAciertos.value >= 80) {
        return '¡Increíble! Tienes un oído musical espectacular.';
    }

    if (porcentajeAciertos.value >= 60) {
        return '¡Muy buen trabajo! Se nota que sabes de música.';
    }

    if (porcentajeAciertos.value >= 40) {
        return '¡Buen intento! Todavía puedes mejorar.';
    }

    return '¡No te rindas! La próxima partida seguro que irá mejor.';
});

// Mensaje según la posición obtenida.
const mensajePosicion = computed(() => {
    if (posicionFinal.value === null) return '';

    if (posicionFinal.value === 1) {
        return '¡Enhorabuena! ¡Estás en el primer puesto!';
    }

    if (posicionFinal.value === 2) {
        return '¡Fantástico! ¡Has conseguido el segundo puesto!';
    }

    if (posicionFinal.value === 3) {
        return '¡Genial! ¡Has conseguido el tercer puesto!';
    }

    return `Has quedado en el puesto ${posicionFinal.value}.`;
});

// Guardamos el resultado y calculamos su posición.
onMounted(async () => {
    if (partidaStore.resultadoGuardado) {
        guardandoResultado.value = false;
        return;
    }

    partidaStore.resultadoGuardado = true;

    try {
        const resultado = await guardarResultado({
            nombre_jugador: partidaStore.nombreJugador,
            puntuacion: partidaStore.puntuacion,
            respuestas_correctas: partidaStore.respuestasCorrectas,
            precision: porcentajeAciertos.value,
            tiempo_total: partidaStore.tiempoTotal
        });

        const idResultado = resultado?.[0]?.id;

        if (idResultado !== undefined) {
            posicionFinal.value = await obtenerPosicionResultado(idResultado);
        }
    } catch (error) {
        console.error('No se pudo guardar o calcular el resultado:', error);

        errorGuardado.value = true;
        partidaStore.resultadoGuardado = false;
    } finally {
        guardandoResultado.value = false;
    }
});
</script>

<template>
    <section class="resultado">

        <div class="resultado-cabecera">
            <div class="icono-contenedor">
                <span class="icono">🏆</span>
            </div>

            <div class="etiqueta">
                <span class="punto"></span>
                CONCURSO FINALIZADO
            </div>

            <h2>¡Lo has conseguido, <span>{{ partidaStore.nombreJugador }}</span>!</h2>

            <p>Has completado todas las rondas musicales. Este es tu resultado.</p>
        </div>

        <div class="tarjeta-resultado">
            <span class="titulo-puntuacion">TU PUNTUACIÓN FINAL</span>

            <strong class="puntuacion">
                {{ partidaStore.puntuacion }}
            </strong>

            <span class="puntos">puntos</span>

            <div class="separador"></div>

            <p class="mensaje">{{ mensajeResultado }}</p>
        </div>

        <div class="estadisticas">
            <div class="estadistica">
                <div class="estadistica-icono icono-aciertos">✓</div>
                <strong>{{ partidaStore.respuestasCorrectas }}</strong>
                <span>Respuestas correctas</span>
            </div>

            <div class="estadistica">
                <div class="estadistica-icono icono-preguntas">♫</div>
                <strong>{{ totalPreguntas }}</strong>
                <span>Preguntas totales</span>
            </div>

            <div class="estadistica">
                <div class="estadistica-icono icono-precision">%</div>
                <strong>{{ porcentajeAciertos }}%</strong>
                <span>Porcentaje de aciertos</span>
            </div>
        </div>

        <div v-if="guardandoResultado" class="estado-guardado">
            <span class="spinner"></span>
            Guardando tu resultado...
        </div>

        <div v-else-if="errorGuardado" class="estado-error">
            <span>!</span>
            <p>
                No se ha podido guardar o calcular tu resultado.
                Inténtalo más tarde.
            </p>
        </div>

        <template v-else>
            <div class="estado-exito">
                <span>✓</span>
                ¡Tu resultado se ha guardado correctamente!
            </div>

            <div v-if="posicionFinal !== null" class="tarjeta-posicion">
                <div class="posicion-icono">🏅</div>

                <span class="posicion-etiqueta">TU POSICIÓN EN EL RANKING</span>

                <h3>{{ mensajePosicion }}</h3>

                <p>Tu posición actual en el ranking general.</p>
            </div>
        </template>

        <div class="acciones">
            <RouterLink to="/concurso" class="boton-jugar">
                Volver a jugar
                <span>↻</span>
            </RouterLink>

            <RouterLink to="/ranking" class="boton-ranking">
                Ver ranking
                <span>→</span>
            </RouterLink>
        </div>

    </section>
</template>

<style scoped>
.resultado {
    width: 100%;
    max-width: 750px;
    margin: 0 auto;
    padding: 1rem 0 3rem;
    text-align: center;
}

/* CABECERA */

.resultado-cabecera {
    margin-bottom: 2rem;
}

.icono-contenedor {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 78px;
    height: 78px;
    margin: 0 auto 1rem;

    background: linear-gradient(135deg, #e5f6eb, #c6e8d7);
    border: 1px solid #d2ecdc;
    border-radius: 24px;
}

.icono {
    font-size: 2.5rem;
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

.resultado-cabecera h2 {
    margin: 0;
    color: #17352b;
    font-size: clamp(1.7rem, 5vw, 2.4rem);
    font-weight: 800;
    letter-spacing: -1px;
}

.resultado-cabecera h2 span {
    color: #42b883;
}

.resultado-cabecera p {
    margin: 0.7rem 0 0;
    color: #718078;
    font-size: 0.95rem;
    line-height: 1.6;
}

/* PUNTUACIÓN PRINCIPAL */

.tarjeta-resultado {
    position: relative;
    overflow: hidden;

    padding: 2.5rem 1.5rem;

    background: linear-gradient(
        135deg,
        #17352b 0%,
        #245d43 50%,
        #42b883 100%
    );

    border-radius: 20px;
    box-shadow: 0 12px 28px rgba(35, 93, 67, 0.2);
}

.tarjeta-resultado::before {
    content: '';
    position: absolute;

    width: 220px;
    height: 220px;

    top: -110px;
    right: -60px;

    background: rgba(255, 255, 255, 0.07);
    border-radius: 50%;
}

.tarjeta-resultado::after {
    content: '';
    position: absolute;

    width: 160px;
    height: 160px;

    bottom: -100px;
    left: -50px;

    background: rgba(255, 255, 255, 0.06);
    border-radius: 50%;
}

.titulo-puntuacion {
    position: relative;
    z-index: 1;

    color: #c6e8d7;
    font-size: 0.8rem;
    font-weight: 800;
    letter-spacing: 1.5px;
}

.puntuacion {
    position: relative;
    z-index: 1;

    display: block;
    margin-top: 0.5rem;

    color: #ffffff;
    font-size: clamp(4rem, 12vw, 5.5rem);
    font-weight: 900;
    line-height: 1.1;
    letter-spacing: -3px;
}

.puntos {
    position: relative;
    z-index: 1;

    display: block;
    margin-top: 0.2rem;

    color: #c6e8d7;
    font-size: 1rem;
    font-weight: 600;
}

.separador {
    width: 55px;
    height: 3px;
    margin: 1.4rem auto;

    background: rgba(255, 255, 255, 0.4);
    border-radius: 10px;
}

.mensaje {
    position: relative;
    z-index: 1;

    margin: 0;

    color: #ffffff;
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.5;
}

/* ESTADÍSTICAS */

.estadisticas {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin: 1.5rem 0;
}

.estadistica {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.6rem;

    padding: 1.4rem 0.7rem;

    background: #ffffff;
    border: 1px solid #e3ebe6;
    border-radius: 15px;
    box-shadow: 0 5px 18px rgba(35, 73, 54, 0.04);
}

.estadistica-icono {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 42px;
    height: 42px;

    border-radius: 12px;
    font-size: 1.3rem;
    font-weight: 800;
}

.icono-aciertos {
    color: #339c6e;
    background: #e5f4eb;
}

.icono-preguntas {
    color: #537eaf;
    background: #eaf2fb;
}

.icono-precision {
    color: #a87919;
    background: #fff6df;
}

.estadistica strong {
    color: #17352b;
    font-size: 1.8rem;
    font-weight: 800;
}

.estadistica span:last-child {
    color: #718078;
    font-size: 0.8rem;
    font-weight: 600;
    line-height: 1.4;
}

/* ESTADOS DE GUARDADO */

.estado-guardado {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.8rem;

    margin: 1.5rem 0;
    padding: 1rem;

    color: #52665b;
    background: #ffffff;
    border: 1px solid #e3ebe6;
    border-radius: 12px;

    font-size: 0.9rem;
    font-weight: 600;
}

.spinner {
    width: 19px;
    height: 19px;

    border: 2px solid #d5eee0;
    border-top-color: #42b883;
    border-radius: 50%;

    animation: girar 0.8s linear infinite;
}

@keyframes girar {
    to {
        transform: rotate(360deg);
    }
}

.estado-exito {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;

    margin: 1.5rem 0;

    color: #287c50;
    font-size: 0.9rem;
    font-weight: 700;
}

.estado-exito span {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 24px;
    height: 24px;

    color: #ffffff;
    background: #42b883;
    border-radius: 50%;

    font-size: 0.8rem;
}

.estado-error {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.7rem;

    margin: 1.5rem 0;
    padding: 1rem;

    color: #991b1b;
    background: #fff0ee;
    border: 1px solid #f5d4ca;
    border-radius: 12px;
}

.estado-error span {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 25px;
    height: 25px;
    flex-shrink: 0;

    color: #ffffff;
    background: #dc6262;
    border-radius: 50%;
    font-weight: 800;
}

.estado-error p {
    margin: 0;
    font-size: 0.9rem;
    font-weight: 600;
    line-height: 1.5;
}

/* POSICIÓN EN EL RANKING */

.tarjeta-posicion {
    margin: 1.5rem 0;
    padding: 1.8rem 1rem;

    background: linear-gradient(135deg, #edf8f2 0%, #ffffff 100%);
    border: 1px solid #cde8d7;
    border-radius: 16px;
    box-shadow: 0 6px 18px rgba(66, 184, 131, 0.07);
}

.posicion-icono {
    margin-bottom: 0.6rem;
    font-size: 2.4rem;
}

.posicion-etiqueta {
    color: #339c6e;
    font-size: 0.75rem;
    font-weight: 800;
    letter-spacing: 1px;
}

.tarjeta-posicion h3 {
    margin: 0.7rem 0;
    color: #17352b;
    font-size: 1.2rem;
    font-weight: 800;
}

.tarjeta-posicion p {
    margin: 0;
    color: #718078;
    font-size: 0.9rem;
}

/* BOTONES */

.acciones {
    display: flex;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
    margin-top: 2rem;
}

.acciones a {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.7rem;

    padding: 0.95rem 1.5rem;

    border-radius: 10px;
    text-decoration: none;
    font-family: inherit;
    font-size: 0.95rem;
    font-weight: 700;

    transition: all 0.2s ease;
}

.boton-jugar {
    color: #ffffff;
    background: linear-gradient(120deg, #245d43, #42b883);
    box-shadow: 0 5px 14px rgba(66, 184, 131, 0.2);
}

.boton-ranking {
    color: #339c6e;
    background: #ffffff;
    border: 1px solid #cde8d7;
}

.boton-jugar:hover,
.boton-ranking:hover {
    transform: translateY(-2px);
}

.boton-jugar:hover {
    box-shadow: 0 8px 18px rgba(66, 184, 131, 0.3);
}

.boton-ranking:hover {
    background: #edf8f2;
    border-color: #42b883;
}

@media (max-width: 550px) {
    .resultado {
        padding-top: 0.5rem;
    }

    .estadisticas {
        grid-template-columns: 1fr;
    }

    .estadistica {
        flex-direction: row;
        justify-content: flex-start;
        padding: 1rem;
        text-align: left;
    }

    .estadistica-icono {
        margin-right: 0.3rem;
    }

    .estadistica strong {
        font-size: 1.5rem;
    }

    .estadistica span:last-child {
        flex: 1;
        text-align: right;
    }

    .tarjeta-resultado {
        padding: 2rem 1rem;
    }

    .acciones {
        flex-direction: column;
    }

    .acciones a {
        width: 100%;
    }
}
</style>

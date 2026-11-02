
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { obtenerRanking } from '../services/rankingService';
import type { ResultadoRanking } from '../types/ranking';

// Guardamos los resultados del ranking.
const ranking = ref<ResultadoRanking[]>([]);

// Estados de carga y error.
const cargando = ref(true);
const errorRanking = ref(false);

// Recuperamos el nombre del jugador actual.
const nombreJugador = sessionStorage.getItem('nombreJugador') ?? '';

// Preparamos los tres primeros puestos del ranking.
const podio = computed(() => [
    { jugador: ranking.value[1], posicion: 2 },
    { jugador: ranking.value[0], posicion: 1 },
    { jugador: ranking.value[2], posicion: 3 }
].filter(item => item.jugador));

// Formateamos la fecha para mostrarla correctamente.
function formatearFecha(fecha: string) {
    return new Date(fecha).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Comprobamos si el resultado pertenece al jugador actual.
function esMiResultado(jugador: ResultadoRanking) {
    return jugador.nombre_jugador.trim().toLowerCase() ===
        nombreJugador.trim().toLowerCase();
}

// Obtenemos el ranking desde Supabase.
onMounted(async () => {
    try {
        ranking.value = await obtenerRanking();
    } catch (error) {
        console.error('Error al obtener el ranking:', error);
        errorRanking.value = true;
    } finally {
        cargando.value = false;
    }
});
</script>

<template>
    <section class="ranking">

        <header class="ranking-cabecera">
            <div class="icono-contenedor">
                <span class="icono-trofeo">🏆</span>
            </div>

            <div class="etiqueta">
                <span class="punto"></span>
                CLASIFICACIÓN GENERAL
            </div>

            <h1>Ranking <span>musical</span></h1>

            <p>
                Descubre quiénes tienen el mejor oído musical.
                ¿Conseguirás llegar a lo más alto?
            </p>
        </header>

        <div v-if="cargando" class="mensaje estado-carga">
            <span class="spinner"></span>
            <p>Cargando clasificación...</p>
        </div>

        <div v-else-if="errorRanking" class="mensaje error">
            <span class="mensaje-icono">!</span>
            <h2>No se ha podido cargar el ranking</h2>
            <p>Inténtalo de nuevo más tarde.</p>
        </div>

        <div v-else-if="ranking.length === 0" class="mensaje">
            <span class="mensaje-icono">🎵</span>
            <h2>¡Todavía no hay resultados!</h2>
            <p>Sé el primero en aparecer en el ranking.</p>
        </div>

        <template v-else>

            <!-- Podio de los tres primeros jugadores -->
            <section class="seccion-podio">
                <div class="titulo-seccion">
                    <div>
                        <span class="subtitulo-seccion">LOS MEJORES</span>
                        <h2>El podio musical</h2>
                    </div>
                    <span class="decoracion-podio">✦</span>
                </div>

                <div v-if="podio.length > 0" class="podio">
                    <article
                        v-for="item in podio"
                        :key="item.jugador!.id"
                        class="podio-tarjeta"
                        :class="[
                            `puesto-${item.posicion}`,
                            { 'mi-resultado': esMiResultado(item.jugador!) }
                        ]"
                    >
                        <span v-if="item.posicion === 1" class="corona">
                            👑
                        </span>

                        <span class="medalla">
                            {{ item.posicion === 1 ? '🥇' : item.posicion === 2 ? '🥈' : '🥉' }}
                        </span>

                        <span class="puesto-texto">
                            {{ item.posicion }}º PUESTO
                        </span>

                        <h3>{{ item.jugador!.nombre_jugador }}</h3>

                        <span
                            v-if="esMiResultado(item.jugador!)"
                            class="etiqueta-tu"
                        >
                            TÚ
                        </span>

                        <strong class="podio-puntos">
                            {{ item.jugador!.puntuacion }}
                        </strong>

                        <span class="texto-puntos">puntos</span>
                    </article>
                </div>
            </section>

            <!-- Tabla completa del ranking -->
            <section class="seccion-tabla">
                <div class="titulo-seccion">
                    <div>
                        <span class="subtitulo-seccion">CLASIFICACIÓN</span>
                        <h2>Todos los jugadores</h2>
                    </div>

                    <span class="contador-jugadores">
                        {{ ranking.length }} jugadores
                    </span>
                </div>

                <div class="tabla-contenedor">
                    <table>
                        <thead>
                            <tr>
                                <th>Posición</th>
                                <th>Jugador</th>
                                <th>Puntos</th>
                                <th>Aciertos</th>
                                <th>Precisión</th>
                                <th>Tiempo</th>
                                <th>Fecha</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr
                                v-for="(jugador, indice) in ranking"
                                :key="jugador.id"
                                :class="{
                                    destacado: indice < 3,
                                    'mi-resultado': esMiResultado(jugador)
                                }"
                            >
                                <td class="posicion">
                                    <span v-if="indice === 0">🥇</span>
                                    <span v-else-if="indice === 1">🥈</span>
                                    <span v-else-if="indice === 2">🥉</span>
                                    <span v-else>{{ indice + 1 }}</span>
                                </td>

                                <td class="nombre">
                                    {{ jugador.nombre_jugador }}

                                    <span
                                        v-if="esMiResultado(jugador)"
                                        class="etiqueta-tu"
                                    >
                                        TÚ
                                    </span>
                                </td>

                                <td class="puntos">
                                    {{ jugador.puntuacion }}
                                </td>

                                <td>
                                    {{ jugador.respuestas_correctas }}/10
                                </td>

                                <td>
                                    <span class="precision">
                                        {{ jugador.precision }}%
                                    </span>
                                </td>

                                <td>
                                    {{ jugador.tiempo_total }} s
                                </td>

                                <td class="fecha">
                                    {{ formatearFecha(jugador.fecha) }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <p class="nota-tabla">
                    <span>ⓘ</span>
                    Tu resultado aparece destacado en verde.
                </p>
            </section>

        </template>
    </section>
</template>

<style scoped>
.ranking {
    width: 100%;
    max-width: 1100px;
    margin: 0 auto;
    padding: 1rem 0 3rem;
}

/* CABECERA */

.ranking-cabecera {
    text-align: center;
    margin-bottom: 3rem;
}

.icono-contenedor {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 76px;
    height: 76px;
    margin: 0 auto 1rem;

    background: linear-gradient(135deg, #e5f6eb, #c6e8d7);
    border: 1px solid #d2ecdc;
    border-radius: 23px;
}

.icono-trofeo {
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
    background: #42b883;
    border-radius: 50%;
}

.ranking-cabecera h1 {
    margin: 0;

    color: #17352b;
    font-size: clamp(2rem, 5vw, 2.8rem);
    font-weight: 800;
    letter-spacing: -1px;
}

.ranking-cabecera h1 span {
    color: #42b883;
}

.ranking-cabecera p {
    max-width: 520px;
    margin: 0.8rem auto 0;

    color: #718078;
    font-size: 0.98rem;
    line-height: 1.6;
}

/* TÍTULOS DE SECCIÓN */

.titulo-seccion {
    display: flex;
    align-items: end;
    justify-content: space-between;
    gap: 1rem;

    margin-bottom: 1.5rem;
}

.subtitulo-seccion {
    color: #42a879;
    font-size: 0.7rem;
    font-weight: 800;
    letter-spacing: 1.5px;
}

.titulo-seccion h2 {
    margin: 0.3rem 0 0;

    color: #17352b;
    font-size: 1.45rem;
    font-weight: 800;
    letter-spacing: -0.4px;
}

.decoracion-podio {
    color: #42b883;
    font-size: 1.8rem;
}

/* PODIO */

.seccion-podio {
    margin-bottom: 3rem;
}

.podio {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    align-items: end;
    gap: 1.2rem;

    max-width: 850px;
    margin: 0 auto;
    padding-top: 1.8rem;
}

.podio-tarjeta {
    position: relative;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    padding: 1.5rem 0.8rem;

    background: #ffffff;
    border: 1px solid #e3ebe6;
    border-radius: 17px;

    text-align: center;
    box-shadow: 0 7px 22px rgba(35, 73, 54, 0.06);

    transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.podio-tarjeta:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 26px rgba(35, 73, 54, 0.1);
}

.puesto-1 {
    min-height: 255px;

    background: linear-gradient(180deg, #edf8f2 0%, #ffffff 100%);
    border: 2px solid #42b883;
    box-shadow: 0 9px 25px rgba(66, 184, 131, 0.12);
}

.puesto-2 {
    min-height: 215px;

    background: linear-gradient(180deg, #f3f6f4 0%, #ffffff 100%);
    border-color: #c8d8cf;
}

.puesto-3 {
    min-height: 195px;

    background: linear-gradient(180deg, #f5eee8 0%, #ffffff 100%);
    border-color: #dfc8b6;
}

.corona {
    position: absolute;
    top: -28px;

    font-size: 2rem;
}

.medalla {
    margin-bottom: 0.5rem;
    font-size: 2.7rem;
}

.puesto-texto {
    color: #718078;
    font-size: 0.75rem;
    font-weight: 800;
    letter-spacing: 0.8px;
}

.podio-tarjeta h3 {
    max-width: 100%;
    margin: 0.7rem 0 0.3rem;

    color: #17352b;
    font-size: 1.05rem;
    font-weight: 800;

    overflow-wrap: anywhere;
}

.podio-puntos {
    margin-top: 0.5rem;

    color: #339c6e;
    font-size: 2rem;
    font-weight: 900;
}

.texto-puntos {
    color: #849188;
    font-size: 0.8rem;
    font-weight: 600;
}

/* ETIQUETA DEL JUGADOR ACTUAL */

.etiqueta-tu {
    display: inline-block;

    margin: 0.2rem 0.3rem;
    padding: 0.25rem 0.55rem;

    color: #ffffff;
    background: #339c6e;
    border-radius: 20px;

    font-size: 0.65rem;
    font-weight: 800;
    letter-spacing: 0.5px;
    vertical-align: middle;
}

/* TABLA */

.seccion-tabla {
    width: 100%;
}

.contador-jugadores {
    padding: 0.45rem 0.8rem;

    color: #339c6e;
    background: #edf8f2;
    border: 1px solid #d5eee0;
    border-radius: 20px;

    font-size: 0.8rem;
    font-weight: 700;
    white-space: nowrap;
}

.tabla-contenedor {
    overflow-x: auto;

    background: #ffffff;
    border: 1px solid #e3ebe6;
    border-radius: 15px;

    box-shadow: 0 6px 22px rgba(35, 73, 54, 0.05);
}

table {
    width: 100%;
    border-collapse: collapse;
    text-align: center;
}

thead {
    color: #ffffff;
    background: linear-gradient(120deg, #17352b 0%, #245d43 100%);
}

th {
    padding: 1.1rem 0.9rem;

    font-size: 0.78rem;
    font-weight: 700;
    white-space: nowrap;
    letter-spacing: 0.2px;
}

td {
    padding: 1rem 0.9rem;

    color: #52665b;
    font-size: 0.88rem;
    white-space: nowrap;
}

tbody tr {
    border-bottom: 1px solid #edf1ee;
    transition: background-color 0.2s ease;
}

tbody tr:last-child {
    border-bottom: none;
}

tbody tr:hover {
    background: #f5faf7;
}

.posicion {
    font-size: 1.15rem;
    font-weight: 800;
}

.nombre {
    color: #294438;
    font-weight: 700;
}

.puntos {
    color: #339c6e;
    font-size: 0.95rem;
    font-weight: 800;
}

.precision {
    display: inline-block;

    padding: 0.3rem 0.6rem;

    color: #339c6e;
    background: #edf8f2;
    border-radius: 7px;

    font-size: 0.8rem;
    font-weight: 700;
}

.fecha {
    color: #849188;
    font-size: 0.82rem;
}

/* PRIMEROS PUESTOS Y RESULTADO PROPIO */

.destacado {
    background: #fbfdfb;
}

.mi-resultado {
    background: #eaf7ef !important;
    outline: 2px solid #42b883;
    outline-offset: -2px;
}

.mi-resultado .nombre {
    color: #247c53;
}

.mi-resultado .puntos {
    color: #247c53;
}

.podio-tarjeta.mi-resultado {
    outline: 2px solid #42b883;
    outline-offset: 3px;
}

/* NOTA DE LA TABLA */

.nota-tabla {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    margin: 1rem 0 0;

    color: #849188;
    font-size: 0.8rem;
}

.nota-tabla span {
    color: #42a879;
    font-size: 1rem;
}

/* MENSAJES Y ESTADOS */

.mensaje {
    display: flex;
    flex-direction: column;
    align-items: center;

    padding: 3rem 1.5rem;

    color: #718078;
    background: #ffffff;
    border: 1px solid #e3ebe6;
    border-radius: 16px;

    text-align: center;
    box-shadow: 0 6px 22px rgba(35, 73, 54, 0.04);
}

.mensaje-icono {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 55px;
    height: 55px;
    margin-bottom: 1rem;

    color: #339c6e;
    background: #edf8f2;
    border-radius: 16px;

    font-size: 2rem;
}

.mensaje h2 {
    margin: 0.3rem 0;
    color: #17352b;
    font-size: 1.3rem;
}

.mensaje p {
    margin: 0.5rem 0 0;
    font-size: 0.9rem;
    line-height: 1.5;
}

.estado-carga {
    min-height: 180px;
    justify-content: center;
    gap: 0.8rem;
}

.spinner {
    width: 27px;
    height: 27px;

    border: 3px solid #d5eee0;
    border-top-color: #42b883;
    border-radius: 50%;

    animation: girar 0.8s linear infinite;
}

@keyframes girar {
    to {
        transform: rotate(360deg);
    }
}

.error .mensaje-icono {
    color: #b45309;
    background: #fff5e5;
}

/* RESPONSIVE */

@media (max-width: 700px) {
    .ranking {
        padding: 0.5rem 0 2rem;
    }

    .podio {
        gap: 0.6rem;
    }

    .podio-tarjeta {
        padding: 1.2rem 0.4rem;
        min-height: 180px;
    }

    .puesto-1 {
        min-height: 220px;
    }

    .puesto-2 {
        min-height: 190px;
    }

    .puesto-3 {
        min-height: 175px;
    }

    .medalla {
        font-size: 2.1rem;
    }

    .podio-tarjeta h3 {
        font-size: 0.85rem;
    }

    .podio-puntos {
        font-size: 1.6rem;
    }

    .puesto-texto {
        font-size: 0.65rem;
    }

    th,
    td {
        padding: 0.85rem 0.7rem;
        font-size: 0.8rem;
    }
}

@media (max-width: 480px) {
    .ranking-cabecera {
        margin-bottom: 2rem;
    }

    .titulo-seccion h2 {
        font-size: 1.2rem;
    }

    .podio {
        gap: 0.4rem;
    }

    .podio-tarjeta {
        padding: 1rem 0.25rem;
    }

    .puesto-1 {
        min-height: 205px;
    }

    .puesto-2 {
        min-height: 175px;
    }

    .puesto-3 {
        min-height: 160px;
    }

    .medalla {
        font-size: 1.8rem;
    }

    .podio-tarjeta h3 {
        font-size: 0.75rem;
    }

    .podio-puntos {
        font-size: 1.4rem;
    }

    .texto-puntos {
        font-size: 0.7rem;
    }

    .etiqueta-tu {
        font-size: 0.6rem;
    }

    .contador-jugadores {
        padding: 0.35rem 0.6rem;
        font-size: 0.7rem;
    }
}
</style>

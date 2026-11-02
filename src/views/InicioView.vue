<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const nombreJugador = ref('')
const errorNombre = ref(false)

function empezarConcurso() {
  const nombre = nombreJugador.value.trim()

  if (nombre === '') {
    errorNombre.value = true
    return
  }

  errorNombre.value = false
  sessionStorage.setItem('nombreJugador', nombre)
  console.log(sessionStorage)
  router.push('/concurso')
}
</script>

<template>
  <section class="inicio">
    <div class="inicio-contenido">
      <div class="etiqueta">
        <span class="punto"></span>
        ¡Pon a prueba tu oído musical!
      </div>

      <h2>¿Cuánto sabes de <span>música?</span></h2>

      <p class="descripcion">
        Escucha fragmentos de canciones y demuestra que eres capaz
        de reconocerlas. ¿Estás preparado para el reto?
      </p>

      <div class="reglas">
        <h3>¿Cómo se juega?</h3>
        <p class="reglas-subtitulo">
          Esto es lo que debes saber antes de empezar
        </p>

        <ul>
          <li>Participarás en 10 rondas musicales.</li>
          <li>En cada ronda escucharás un fragmento de una canción.</li>
          <li>Tendrás cuatro respuestas posibles.</li>
          <li>Sumarás 10 puntos por cada acierto.</li>
          <li>Perderás 5 puntos por cada respuesta incorrecta.</li>
          <li>¡Intenta conseguir un puesto en el ranking!</li>
        </ul>
      </div>

      <div class="nombre-jugador">
        <label for="nombre">Tu nombre de jugador</label>

        <input
          id="nombre"
          v-model="nombreJugador"
          @input="errorNombre = false"
          type="text"
          placeholder="Escribe tu nombre..."
          maxlength="30"
        />

        <Transition name="slide">
          <p v-if="errorNombre" class="mensaje-error">
            <span>ⓘ</span>
            Por favor, introduce tu nombre antes de jugar.
          </p>
        </Transition>
      </div>

      <button @click="empezarConcurso">
        ¡Empezar a jugar!
        <span>→</span>
      </button>
    </div>
  </section>
</template>

<style scoped>
.inicio {
  display: flex;
  justify-content: center;
  padding: 1rem 0 3rem;
}

.inicio-contenido {
  width: 100%;
  max-width: 720px;
  padding: 2.5rem;

  text-align: center;
  background: #ffffff;
  border: 1px solid #e3ebe6;
  border-radius: 22px;
  box-shadow: 0 12px 35px rgba(35, 73, 54, 0.07);
}

.etiqueta {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;

  margin-bottom: 1.2rem;
  padding: 0.5rem 1rem;

  color: #339c6e;
  background: #edf8f2;
  border: 1px solid #d5eee0;
  border-radius: 30px;

  font-size: 0.85rem;
  font-weight: 700;
}

.punto {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #42b883;
}

.inicio h2 {
  margin: 0;
  color: #17352b;
  font-size: clamp(2rem, 5vw, 2.8rem);
  font-weight: 800;
  letter-spacing: -1.2px;
}

.inicio h2 span {
  color: #42b883;
}

.descripcion {
  max-width: 540px;
  margin: 1rem auto 2rem;

  color: #718078;
  font-size: 1.05rem;
  line-height: 1.7;
}

.reglas {
  margin: 0 auto 2rem;
  padding: 1.6rem 1.8rem;

  text-align: left;
  background: #f7faf8;
  border: 1px solid #e3ebe6;
  border-radius: 16px;
}

.reglas h3 {
  margin: 0 0 0.4rem;
  color: #17352b;
  font-size: 1.2rem;
}

.reglas-subtitulo {
  margin: 0 0 1.2rem;
  color: #849188;
  font-size: 0.9rem;
}

.reglas ul {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;

  margin: 0;
  padding: 0;
  list-style: none;
}

.reglas li {
  position: relative;
  padding-left: 1.7rem;

  color: #52665b;
  font-size: 0.95rem;
  line-height: 1.5;
}

.reglas li::before {
  content: '✓';
  position: absolute;
  left: 0;
  top: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 20px;
  height: 20px;

  color: #339c6e;
  background: #dff3e8;
  border-radius: 50%;

  font-size: 0.75rem;
  font-weight: 800;
}

.nombre-jugador {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;

  max-width: 400px;
  margin: 0 auto 1.5rem;
  text-align: left;
}

.nombre-jugador label {
  color: #294438;
  font-size: 0.95rem;
  font-weight: 700;
}

.nombre-jugador input {
  width: 100%;
  padding: 0.95rem 1rem;

  color: #24332d;
  background: #ffffff;
  border: 1px solid #dce7e0;
  border-radius: 10px;

  font-family: inherit;
  font-size: 1rem;

  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.nombre-jugador input::placeholder {
  color: #a2afa7;
}

.nombre-jugador input:focus {
  border-color: #42b883;
  box-shadow: 0 0 0 3px rgba(66, 184, 131, 0.13);
}

.mensaje-error {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  margin: 0.2rem 0 0;
  padding: 0.7rem 0.9rem;

  color: #b45309;
  background: #fff8e8;
  border: 1px solid #f5dfb5;
  border-radius: 9px;

  font-size: 0.85rem;
  font-weight: 500;
}

.mensaje-error span {
  font-size: 1rem;
}

/* Animación del mensaje */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.25s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;

  padding: 0.95rem 1.8rem;

  color: #ffffff;
  background: linear-gradient(120deg, #245d43 0%, #42b883 100%);
  border: none;
  border-radius: 11px;

  font-family: inherit;
  font-size: 1rem;
  font-weight: 700;

  cursor: pointer;
  box-shadow: 0 5px 14px rgba(66, 184, 131, 0.22);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

button span {
  font-size: 1.2rem;
  transition: transform 0.2s ease;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(66, 184, 131, 0.3);
}

button:hover span {
  transform: translateX(4px);
}

@media (max-width: 600px) {
  .inicio-contenido {
    padding: 1.5rem 1.1rem;
    border-radius: 16px;
  }

  .reglas {
    padding: 1.3rem 1rem;
  }

  .descripcion {
    font-size: 0.95rem;
  }

  button {
    width: 100%;
  }
}
</style>

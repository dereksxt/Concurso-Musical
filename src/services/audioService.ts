import { Howl } from 'howler';

let audioActual: Howl | null = null;

// Reproducimos un fragmento aleatorio de cinco segundos.
export function reproducirFragmento(ruta: string) {
    detenerAudio();

    const nuevoAudio = new Howl({
        src: [ruta],
        html5: true,

        onload: () => {
            // Comprobamos que sigue siendo el audio actual.
            if (audioActual !== nuevoAudio) return;

            // Obtenemos la duración real del archivo.
            const duracion = nuevoAudio.duration();

            // Calculamos un inicio aleatorio sin salirnos de la canción.
            const inicioMaximo = Math.max(0, duracion - 5);
            const inicioAleatorio = Math.random() * inicioMaximo;

            // Empezamos desde ese segundo.
            nuevoAudio.seek(inicioAleatorio);
            nuevoAudio.play();
        },

        onloaderror: (_id, error) => {
            console.error('Error al cargar el audio:', error);
        }
    });

    audioActual = nuevoAudio;
}

// Detenemos y liberamos el audio.
export function detenerAudio() {
    if (audioActual) {
        audioActual.stop();
        audioActual.unload();
        audioActual = null;
    }
}

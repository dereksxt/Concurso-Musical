
import { supabase } from '../lib/supabase';

// Obtenemos los 10 mejores resultados.
export async function obtenerRanking() {
    const { data, error } = await supabase
        .from('ranking')
        .select('*')
        .order('puntuacion', { ascending: false })
        .order('tiempo_total', { ascending: true })
        .order('fecha', { ascending: true })
        .limit(10);

    if (error) {
        console.error('Error al obtener el ranking:', error);
        throw error;
    }

    return data;
}

// Guardamos el resultado de una partida.
export async function guardarResultado(resultado: {
    nombre_jugador: string;
    puntuacion: number;
    respuestas_correctas: number;
    precision: number;
    tiempo_total: number;
}) {
    const { data, error } = await supabase
        .from('ranking')
        .insert(resultado)
        .select();

    if (error) {
        console.error('Error al guardar el resultado:', error);
        throw error;
    }

    return data;
}


export async function obtenerPosicionResultado(idResultado: number) {
    const { data, error } = await supabase
        .from('ranking')
        .select('id')
        .order('puntuacion', { ascending: false })
        .order('tiempo_total', { ascending: true })
        .order('fecha', { ascending: true });

    if (error) {
        console.error('Error al calcular la posición:', error);
        throw error;
    }

    const indice = data.findIndex((resultado) => resultado.id === idResultado);

    return indice === -1 ? null : indice + 1;
}

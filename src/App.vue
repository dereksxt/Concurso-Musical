
<script setup lang="ts">
// Componente principal de la aplicación.
// RouterView muestra la página correspondiente a la ruta actual.
import { RouterView } from 'vue-router';
import NavBar from './components/NavBar.vue';
</script>

<template>
    <div class="app">
        <header class="app-header">
            <h1>Concurso Musical</h1>
            <p>¿Cuánto sabes de música?</p>
        </header>

        <NavBar />

        <main class="app-main">
            <RouterView />
        </main>
    </div>
</template>

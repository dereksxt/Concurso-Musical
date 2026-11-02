<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <nav class="navbar">
    <RouterLink to="/">Inicio</RouterLink>
    <RouterLink to="/concurso">Concurso</RouterLink>
    <RouterLink to="/ranking">Ranking</RouterLink>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;

  padding: 1rem;

  background-color: #ffffff;
  border-bottom: 1px solid #e3ebe6;
  box-shadow: 0 4px 15px rgba(35, 73, 54, 0.04);
}

.navbar a {
  padding: 0.7rem 1.4rem;

  color: #52665b;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;

  border-radius: 10px;
  transition: all 0.25s ease;
}

.navbar a:hover {
  color: #339c6e;
  background-color: #edf8f2;
}

.navbar a.router-link-active {
  color: #ffffff;
  background: linear-gradient(120deg, #245d43 0%, #42b883 100%);
  box-shadow: 0 4px 12px rgba(66, 184, 131, 0.2);
}

@media (max-width: 480px) {
  .navbar {
    gap: 0.4rem;
    padding: 0.8rem 0.5rem;
  }

  .navbar a {
    padding: 0.65rem 1rem;
    font-size: 0.9rem;
  }
}
</style>

import { createRouter, createWebHistory } from 'vue-router'

// Componentes
import ConcursoView from '@/views/ConcursoView.vue'
import InicioView from '@/views/InicioView.vue'
import RankingView from '@/views/RankingView.vue'
import ResultadoView from '../views/ResultadoView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'inicio',
      component: InicioView,
  }
  ,{
      path: '/concurso',
      name: 'concurso',
      component: ConcursoView,
  }
  ,{
      path: '/ranking',
      name: 'ranking',
      component: RankingView,
  }
  ,{
      path: '/resultado',
      name: 'resultado',
      component: ResultadoView
  }
],
})

export default router

import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/wechselrichter',
      name: 'wechselrichter',
      component: () => import('../views/WechselrichterView.vue')
    },
    {
      path: '/wechselrichter/:id',
      name: 'wechselrichterid',
      component: () => import('../views/WechselrichterView.vue')
    },
    {
      path: '/solarmodule',
      name: 'solarmodule',
      component: () => import('../views/SolarmoduleView.vue')
    },
    {
      path: '/rechner',
      name: 'rechner',
      component: () => import('../views/RechnerView.vue')
    }
  ]
})

export default router

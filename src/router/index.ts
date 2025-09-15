import { createRouter, createWebHistory } from 'vue-router'

// Importamos las vistas
import Inicio from '@/views/Inicio.vue'
//import Cuadrado from '@/views/Cuadrado.vue'
//import Producto from '@/views/Producto.vue'
import Lineal from '@/views/Lineal.vue'
import Multiplicativo from '@/views/Multiplicativo.vue'

const routes = [
  { path: '/', name: 'Inicio', component: Inicio },
  //{ path: '/cuadrado', name: 'Cuadrado', component: Cuadrado },
  //{ path: '/producto', name: 'Producto', component: Producto },
  { path: '/lineal', name: 'Lineal', component: Lineal },
  { path: '/multiplicativo', name: 'Multiplicativo', component: Multiplicativo },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

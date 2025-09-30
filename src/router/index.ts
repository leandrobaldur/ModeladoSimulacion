import { createRouter, createWebHistory } from 'vue-router'

// Importamos las vistas
import Inicio from '@/views/Inicio.vue'
import Simulaciones from '@/views/Simulaciones.vue'
//import Producto from '@/views/Producto.vue'
import Lineal from '@/views/Lineal.vue'
import Multiplicativo from '@/views/Multiplicativo.vue'
import DPF from '../components/DPF.vue'
import Apostador from '../components/Apostador.vue'
import Tienda from '../components/Tienda.vue'

const routes = [
  { path: '/', name: 'Inicio', component: Inicio },
  { path: '/simulaciones', name: 'Simulaciones', component: Simulaciones },
  { path: '/dpf', name: 'DPF', component: DPF },
  { path: '/lineal', name: 'Lineal', component: Lineal },
  { path: '/multiplicativo', name: 'Multiplicativo', component: Multiplicativo },
  { path: '/apostador', name: 'Apostador', component: Apostador },
  { path: '/tienda', name: 'Tienda', component: Tienda },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

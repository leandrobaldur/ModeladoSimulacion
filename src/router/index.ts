import { createRouter, createWebHistory } from 'vue-router'

import Inicio from '@/views/Inicio.vue'
import Simulaciones from '@/views/Simulaciones.vue'
import Lineal from '@/views/Lineal.vue'
import Multiplicativo from '@/views/Multiplicativo.vue'
import DPF from '../components/DPF.vue'
import Apostador from '../components/Apostador.vue'
import Tienda from '../components/Tienda.vue'
import Gallinero from '../components/Gallinero.vue'
import Azucarero from '../components/Azucarero.vue'
import DPV from '../components/DPV.vue'
import Moneda from '../components/Moneda.vue'

const routes = [
  { path: '/', name: 'Inicio', component: Inicio },
  { path: '/simulaciones', name: 'Simulaciones', component: Simulaciones },
  { path: '/dpf', name: 'DPF', component: DPF },
  { path: '/lineal', name: 'Lineal', component: Lineal },
  { path: '/multiplicativo', name: 'Multiplicativo', component: Multiplicativo },
  { path: '/apostador', name: 'Apostador', component: Apostador },
  { path: '/tienda', name: 'Tienda', component: Tienda },
  { path: '/gallinero', name: 'Gallinero', component: Gallinero },
  { path: '/azucarero', name: 'Azucarero', component: Azucarero },
  { path: '/dpv', name: 'DPV', component: DPV },
  { path: '/moneda', name: 'Moneda', component: Moneda },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

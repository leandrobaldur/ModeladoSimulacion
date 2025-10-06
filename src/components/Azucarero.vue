<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="main-container"> 
    
    <div class="content-wrapper"> 
      
      <button class="close-button" @click="goBackToSimulaciones">X</button>
      
      <div class="algorithm-container">
        
        <h2 class="title">Azúcarero</h2>

        <div class="info-alert">
          <div class="section-text">
            Simula el inventario de azúcar por {{ diasSimulados }} días con un sistema de revisión cada {{ periodoRevision }} días y capacidad de {{ capacidadBodega }} kg.
          </div>
        </div>

        <div class="input-grid">
          
          <div class="input-group">
            <label class="input-label">Días a Simular</label>
            <input v-model.number="diasSimulados" type="number" placeholder="27" class="input-field" />
          </div>

          <div class="input-group">
            <label class="input-label">Capacidad Bodega kg</label>
            <input v-model.number="capacidadBodega" type="number" placeholder="700" class="input-field" />
          </div>

          <div class="input-group">
            <label class="input-label">Periodo de Revisión días</label>
            <input v-model.number="periodoRevision" type="number" placeholder="7" class="input-field" />
          </div>
          
          <div class="input-group">
            <label class="input-label">Costo Ordenar Bs</label>
            <input v-model.number="costoOrdenar" type="number" placeholder="100.00" class="input-field" />
          </div>
          
          <div class="input-group">
            <label class="input-label">Costo Inv. kg/día</label>
            <input v-model.number="costoMantenimiento" type="number" placeholder="0.10" class="input-field" />
          </div>

          <div class="input-group">
            <label class="input-label">Costo Adquisición bs/kg</label>
            <input v-model.number="costoAdquisicion" type="number" placeholder="3.50" class="input-field" />
          </div>
          
          <div class="input-group">
            <label class="input-label">Precio Venta bs/kg</label>
            <input v-model.number="precioVenta" type="number" placeholder="5.00" class="input-field" />
          </div>

          <div class="button-group wide-button-group">
            <button @click="simularInventario" class="button button-primary">Simular {{ diasSimulados }} Días</button>
            <button @click="limpiarResultados" class="button button-error">Limpiar</button>
          </div>
          
          <div class="input-group">
            <label class="input-label">Costo Total Bs</label>
            <input :value="costoTotal.toFixed(2)" type="text" disabled class="input-field disabled-field" />
          </div>

          <div class="input-group">
            <label class="input-label">Ganancia Neta Bs</label>
            <input :value="gananciaNeta.toFixed(2)" type="text" disabled class="input-field disabled-field" />
          </div>
          
          <div class="input-group">
            <label class="input-label">Demanda Insatisfecha kg</label>
            <input :value="demandaInsatisfecha.toFixed(2)" type="text" disabled class="input-field disabled-field" />
          </div>
          
          <div class="input-group">
            <label class="input-label">Ventas Realizadas kg</label>
            <input :value="ventasRealizadasTotal.toFixed(2)" type="text" disabled class="input-field disabled-field" />
          </div>
          
        </div>

        ---

        <div v-if="costoTotal > 0" class="summary-footer">
            <h4>RESUMEN FINANCIERO DE {{ diasSimulados }} DÍAS</h4>
            <p>Ingreso Total por Ventas: {{ ingresoTotalVentas.toFixed(2) }} Bs</p>
            <p>Costo Total (Orden + Inventario + Adquisición): {{ costoTotal.toFixed(2) }} Bs</p>
            <p class="summary-highlight">Ganancia Neta Final: {{ gananciaNeta.toFixed(2) }} Bs</p>
            <p>Demanda Insatisfecha : {{ demandaInsatisfecha.toFixed(2) }} kg</p>
        </div>
        
        <div v-if="resultadosDiarios.length > 0" class="table-container">
          <table class="data-table">
            <thead class="table-header">
              <tr>
                <th>Día</th>
                <th>Inv. Inicial</th>
                <th>Demanda (D)</th>
                <th>Pedido (Q)</th>
                <th>Entrega (L)</th>
                <th>Inv. Final</th>
                <th>Venta Pérdida</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="res in resultadosDiarios" :key="res.dia" class="table-row">
                <td>{{ res.dia }}</td>
                <td>{{ res.inventarioInicial.toFixed(2) }}</td>
                <td>{{ res.demanda.toFixed(2) }}</td>
                <td :class="{'final-capital': res.cantidadPedido > 0}">{{ res.cantidadPedido.toFixed(2) }}</td>
                <td :class="{'final-capital': res.tiempoEntregaRestante > 0}">{{ res.tiempoEntregaRestante > 0 ? res.tiempoEntregaRestante : '---' }}</td>
                <td :class="{'final-capital': res.inventarioFinal >= 200, 'perdida-casa': res.inventarioFinal < 100}">{{ res.inventarioFinal.toFixed(2) }}</td>
                <td>{{ res.demandaInsatisfecha.toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
function goBackToSimulaciones() {
  router.push('/simulaciones'); 
}

interface ResultadoDia {
  dia: number;
  inventarioInicial: number;
  demanda: number;
  cantidadPedido: number;
  tiempoEntregaRestante: number;
  inventarioFinal: number;
  ventasRealizadas: number;
  demandaInsatisfecha: number;
}

const diasSimulados = ref<number>(27);
const capacidadBodega = ref<number>(700);
const periodoRevision = ref<number>(7);
const costoOrdenar = ref<number>(100.0);      
const costoMantenimiento = ref<number>(0.1);  
const costoAdquisicion = ref<number>(3.5);    
const precioVenta = ref<number>(5.0);         
const inventarioInicial = ref<number>(400); 
const pedidoPendiente = ref<number>(0);
const tiempoEntregaRestante = ref<number>(0);
const costoTotal = ref<number>(0);
const gananciaNeta = ref<number>(0);
const demandaInsatisfecha = ref<number>(0);
const ingresoTotalVentas = ref<number>(0);
const costoTotalOrdenes = ref<number>(0);
const costoTotalMantenimiento = ref<number>(0);
const costoTotalAdquisicion = ref<number>(0);
const ventasRealizadasTotal = ref<number>(0); 

const resultadosDiarios = ref<ResultadoDia[]>([]);

function generarDemandaExponencial(): number {
    const lambda = 0.01; 
    const R = Math.random();
    return (-1 / lambda) * Math.log(R);
}

function generarTiempoEntregaUniforme(): number {
    const R = Math.random(); 
    return Math.ceil(R * 3); 
}

function simularInventario() {
    if (diasSimulados.value <= 0 || capacidadBodega.value <= 0 || periodoRevision.value <= 0 || 
        costoOrdenar.value < 0 || costoMantenimiento.value < 0 || costoAdquisicion.value < 0 || precioVenta.value <= 0) {
        alert('Por favor ingresa valores válidos y positivos para todos los parámetros.');
        limpiarTotales();
        return;
    }
    limpiarTotales();
    let inventarioActual = inventarioInicial.value;

    for (let dia = 1; dia <= diasSimulados.value; dia++) {

        const invInicialDia = inventarioActual;         
        let cantidadPedidoDia = 0;
        let tiempoEntregaDia = 0;
        if ((dia - 1) % periodoRevision.value === 0) {
            const Q = capacidadBodega.value - inventarioActual;
            
            if (Q > 0) {
                cantidadPedidoDia = Q;
                pedidoPendiente.value = Q;
                costoTotalOrdenes.value += costoOrdenar.value;
                tiempoEntregaRestante.value = generarTiempoEntregaUniforme();
                tiempoEntregaDia = tiempoEntregaRestante.value;
            }
        }

        if (tiempoEntregaRestante.value > 0) {
            tiempoEntregaRestante.value -= 1;

            if (tiempoEntregaRestante.value === 0) {
                inventarioActual += pedidoPendiente.value;
                costoTotalAdquisicion.value += pedidoPendiente.value * costoAdquisicion.value; 
                pedidoPendiente.value = 0;
            }
        }

        const demandaDia = generarDemandaExponencial();
        
        let ventasRealizadas = 0;
        let demandaInsatisfechaDia = 0;

        if (inventarioActual >= demandaDia) {
            ventasRealizadas = demandaDia;
            inventarioActual -= demandaDia;
        } else {
            ventasRealizadas = inventarioActual;
            demandaInsatisfechaDia = demandaDia - inventarioActual;
            inventarioActual = 0;
        }

        costoTotalMantenimiento.value += inventarioActual * costoMantenimiento.value; 

        demandaInsatisfecha.value += demandaInsatisfechaDia;
        ventasRealizadasTotal.value += ventasRealizadas;
        ingresoTotalVentas.value += ventasRealizadas * precioVenta.value; 

        resultadosDiarios.value.push({
            dia: dia,
            inventarioInicial: invInicialDia, 
            demanda: demandaDia,
            cantidadPedido: cantidadPedidoDia,
            tiempoEntregaRestante: tiempoEntregaDia, 
            inventarioFinal: inventarioActual,
            ventasRealizadas: ventasRealizadas,
            demandaInsatisfecha: demandaInsatisfechaDia,
        });
    }

    costoTotal.value = costoTotalOrdenes.value + costoTotalMantenimiento.value + costoTotalAdquisicion.value;
    gananciaNeta.value = ingresoTotalVentas.value - costoTotal.value;
}

function limpiarTotales() {
    costoTotal.value = 0;
    gananciaNeta.value = 0;
    demandaInsatisfecha.value = 0;
    ingresoTotalVentas.value = 0;
    costoTotalOrdenes.value = 0;
    costoTotalMantenimiento.value = 0;
    costoTotalAdquisicion.value = 0;
    ventasRealizadasTotal.value = 0;
    resultadosDiarios.value = [];

    inventarioInicial.value = 400; 
    pedidoPendiente.value = 0;
    tiempoEntregaRestante.value = 0;
}

function limpiarResultados() {
    diasSimulados.value = 27;
    capacidadBodega.value = 700;
    periodoRevision.value = 7;
    costoOrdenar.value = 100.0;
    costoMantenimiento.value = 0.1;
    costoAdquisicion.value = 3.5;
    precioVenta.value = 5.0;
    
    limpiarTotales();
}
</script>

<style scoped>

@media (min-width: 768px) { 
    .input-grid { 
        grid-template-columns: repeat(4, 1fr); 
    }
    .wide-button-group {
        grid-column: span 2; 
    }
}
.summary-footer { margin-top: 1.5rem; padding: 1rem; background-color: #333; border-radius: 0.5rem; }
.summary-footer h4 { color: #4caf50; font-size: 1.4rem; margin-bottom: 1rem; }
.summary-footer p { margin: 0.5rem 0; font-size: 1rem; color: #c0c0c0; }
.summary-highlight { font-size: 1.2rem !important; font-weight: bold; color: #4caf50 !important; border-top: 1px solid #4a4a4a; padding-top: 0.5rem; margin-top: 1rem !important; }

.content-wrapper { position: relative; }
.close-button { position: absolute; top: 1.5rem; right: 1.5rem; background: none; border: none; color: #c0c0c0; font-size: 1.5rem; font-weight: bold; cursor: pointer; padding: 0; line-height: 1; transition: color 0.2s, transform 0.2s; z-index: 10; }
.close-button:hover { color: #f44336; transform: scale(1.1); }

.input-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 2rem; }
.button-group { display: flex; align-items: flex-end; gap: 0.75rem; grid-column: span 1 / span 1; }
.main-container { min-height: 100vh; max-width: none; background: linear-gradient(to right, #1a1a1a, #0d0d0d); display: flex; align-items: center; justify-content: center; padding: 1.5rem; width: 100%; }
.content-wrapper { width: 100%; max-width: 90rem; background-color: #2e2e2e; border-radius: 1.5rem; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2); padding: 1.5rem; color: white; }
.title { font-size: 2.5rem; font-weight: 800; text-align: center; margin-bottom: 3rem; color: #4caf50; }
.info-alert { background-color: #388e3c; border-radius: 0.5rem; margin-bottom: 2rem; padding: 1rem; color: white; }
.section-text { font-size: 1rem; line-height: 1.5; color: #f0f0f0; }
.section-text ul { margin: 0.5rem 0 0 1rem; padding: 0; list-style-type: disc; }
.section-text li { margin-bottom: 0.25rem; }
.input-group { display: flex; flex-direction: column; }
.input-label { font-weight: 600; margin-bottom: 0.25rem; color: #c0c0c0; }
.input-field { width: 100%; border: 1px solid #4a4a4a; border-radius: 0.5rem; padding: 0.5rem 0.75rem; outline: none; transition: box-shadow 0.2s; background-color: #333; color: white; }
.disabled-field { background-color: #444; color: #999; }
.button { flex: 1; padding: 0.5rem 1rem; border-radius: 0.5rem; font-weight: 600; color: black; border: none; cursor: pointer; transition: transform 0.2s; }
.button-primary { background-color: #4caf50; }
.button-error { background-color: #d32f2f; }
.table-container { overflow-x: auto; border-radius: 0.5rem; margin-top: 2rem; }
.data-table { width: 100%; text-align: center; border-collapse: collapse; }
.table-header { background-color: #4caf50; color: white; }
.table-header th { padding: 0.75rem 0.75rem; }
.table-row:nth-child(even) { background-color: #4a4a4a; }
.table-row:nth-child(odd) { background-color: #333333; }
.table-row td { padding: 0.75rem 0.75rem; }
.final-capital { font-weight: 700; color: #4caf50; font-size: 1.1rem; }
.perdida-casa { font-weight: 700; color: #f44336; font-size: 1.1rem; }
</style>
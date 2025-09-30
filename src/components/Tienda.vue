<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="main-container"> 
    
    <div class="content-wrapper"> 
      
      <button class="close-button" @click="goBackToSimulaciones">X</button>
      
      <div class="algorithm-container">
        
        <h2 class="title">Operaciones de Tienda</h2>

        <div class="info-alert">
          <div class="section-text">
            Simula las ventas por hora:
            <ul>
              <li>Llegada de Clientes: Número aleatorio de 0 a 2 clientes por hora.</li>
              <li>Función de Compra: Probabilidades de comprar 0, 1, 2, o 3 artículos.</li>
              <li>Costos: Fijo diario de {{ costoFijoDiario }} Bs, y {{ costoArticulo }} Bs por artículo.</li>
              <li>Venta: Precio de {{ precioVentaArticulo }} Bs por artículo.</li>
            </ul>
          </div>
        </div>

        <div class="input-grid">
          
          <div class="input-group">
            <label class="input-label">Horas a Simular (Día)</label>
            <input v-model.number="horasSimuladas" type="number" placeholder="Ej: 8" class="input-field" />
          </div>

          <div class="input-group">
            <label class="input-label">Costo Fijo Diario (Bs)</label>
            <input v-model.number="costoFijoDiario" type="number" placeholder="300" class="input-field" />
          </div>

          <div class="input-group">
            <label class="input-label">Costo por Artículo (Bs)</label>
            <input v-model.number="costoArticulo" type="number" placeholder="50" class="input-field" />
          </div>

          <div class="input-group">
            <label class="input-label">Precio de Venta (Bs)</label>
            <input v-model.number="precioVentaArticulo" type="number" placeholder="75" class="input-field" />
          </div>
          
          <div class="input-group">
            <label class="input-label">Artículos Vendidos (Total)</label>
            <input :value="articulosVendidosTotal" type="text" disabled class="input-field disabled-field" />
          </div>

          <div class="input-group">
            <label class="input-label">Ganancia Neta (Total Bs)</label>
            <input :value="gananciaNetaTotal.toFixed(2)" type="text" disabled class="input-field disabled-field" />
          </div>
          
          <div class="button-group">
            <button @click="simularDia" class="button button-primary">Simular Día</button>
          </div>
          
          <div class="button-group">
            <button @click="limpiarResultados" class="button button-error">Limpiar</button>
          </div>
        </div>
        
        <div v-if="resultadosHorarios.length > 0" class="table-container">
          <table class="data-table">
            <thead class="table-header">
              <tr>
                <th>Hora</th>
                <th>Clientes Llegaron</th>
                <th>Artículos Vendidos (Hora)</th>
                <th>Ingreso Bruto (Hora Bs)</th>
                <th>Costo Variable (Hora Bs)</th>
                <th>Ganancia Bruta (Hora Bs)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="res in resultadosHorarios" :key="res.hora" class="table-row">
                <td>{{ res.hora }}</td>
                <td>{{ res.clientesLlegaron }}</td>
                <td>{{ res.articulosVendidosHora }}</td>
                <td>{{ res.ingresoBrutoHora.toFixed(2) }}</td>
                <td>{{ res.costoVariableHora.toFixed(2) }}</td>
                <td :class="{'final-capital': res.gananciaBrutaHora >= 0, 'perdida-casa': res.gananciaBrutaHora < 0}">
                    {{ res.gananciaBrutaHora.toFixed(2) }}
                </td>
              </tr>
              <tr class="table-row final-summary-row">
                  <td colspan="2" class="summary-label">TOTALES DEL DÍA:</td>
                  <td>{{ articulosVendidosTotal }}</td>
                  <td>{{ (articulosVendidosTotal * precioVentaArticulo).toFixed(2) }}</td>
                  <td>{{ (articulosVendidosTotal * costoArticulo).toFixed(2) }}</td>
                  <td>{{ (ingresoBrutoTotal - costoVariableTotal).toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
          
          <div class="summary-footer">
              <p>Total ingresos brutos: {{ ingresoBrutoTotal.toFixed(2) }} Bs</p>
              <p>Total costos variables: {{ costoVariableTotal.toFixed(2) }} Bs</p>
              <p>Costo fijo diario: {{ costoFijoDiario.toFixed(2) }} Bs</p>
              <h4 :class="{'final-capital': gananciaNetaTotal >= 0, 'perdida-casa': gananciaNetaTotal < 0}">GANANCIA NETA FINAL: {{ gananciaNetaTotal.toFixed(2) }} Bs</h4>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

interface ResultadoHora {
  hora: number;
  clientesLlegaron: number;
  articulosVendidosHora: number;
  ingresoBrutoHora: number;
  costoVariableHora: number;
  gananciaBrutaHora: number;
}

const router = useRouter();
function goBackToSimulaciones() {
  router.push('/simulaciones'); 
}

const horasSimuladas = ref<number>(8); 
const costoFijoDiario = ref<number>(300);
const costoArticulo = ref<number>(50);
const precioVentaArticulo = ref<number>(75);

const articulosVendidosTotal = ref<number>(0);
const ingresoBrutoTotal = ref<number>(0);
const costoVariableTotal = ref<number>(0);
const gananciaNetaTotal = ref<number>(0);
const resultadosHorarios = ref<ResultadoHora[]>([]);

function determinarCompra(): number {
    const random = Math.random();
    if (random < 0.2) return 0;      
    if (random < 0.5) return 1;       
    if (random < 0.9) return 2;       
    return 3;                         
}

function simularDia() {
    if (horasSimuladas.value <= 0 || costoFijoDiario.value <= 0 || costoArticulo.value <= 0 || precioVentaArticulo.value <= 0) {
        alert('Por favor, ingresa valores positivos válidos para todos los campos.');
        limpiarTotales();
        return;
    }
    
    limpiarTotales();
    
    for (let h = 1; h <= horasSimuladas.value; h++) {
        
        const clientesLlegaron = Math.floor(Math.random() * 3); 
        let articulosVendidosHora = 0;

        for (let c = 0; c < clientesLlegaron; c++) {
            articulosVendidosHora += determinarCompra();
        }

        const ingresoBrutoHora = articulosVendidosHora * precioVentaArticulo.value;
        const costoVariableHora = articulosVendidosHora * costoArticulo.value;
        const gananciaBrutaHora = ingresoBrutoHora - costoVariableHora;
        
        articulosVendidosTotal.value += articulosVendidosHora;
        ingresoBrutoTotal.value += ingresoBrutoHora;
        costoVariableTotal.value += costoVariableHora;

        resultadosHorarios.value.push({
            hora: h,
            clientesLlegaron: clientesLlegaron,
            articulosVendidosHora: articulosVendidosHora,
            ingresoBrutoHora: ingresoBrutoHora,
            costoVariableHora: costoVariableHora,
            gananciaBrutaHora: gananciaBrutaHora,
        });
    }

    gananciaNetaTotal.value = ingresoBrutoTotal.value - costoVariableTotal.value - costoFijoDiario.value;
}

function limpiarTotales() {
    articulosVendidosTotal.value = 0;
    ingresoBrutoTotal.value = 0;
    costoVariableTotal.value = 0;
    gananciaNetaTotal.value = 0;
    resultadosHorarios.value = [];
}

function limpiarResultados() {
    horasSimuladas.value = 8;
    costoFijoDiario.value = 300;
    costoArticulo.value = 50;
    precioVentaArticulo.value = 75;
    limpiarTotales();
}
</script>

<style scoped>

.info-alert ul {
    margin: 0.5rem 0 0 1rem;
    padding: 0;
    list-style-type: disc;
}
.info-alert li {
    margin-bottom: 0.25rem;
}
.final-summary-row {
    background-color: #388e3c !important; 
    font-weight: bold;
    color: white;
    border-top: 3px solid #4caf50;
}
.summary-label {
    text-align: right;
    padding-right: 1rem;
    font-size: 1.1rem;
}
.summary-footer {
    margin-top: 1.5rem;
    padding: 1rem;
    background-color: #333;
    border-radius: 0.5rem;
}
.summary-footer p {
    margin: 0.5rem 0;
    font-size: 1rem;
    color: #c0c0c0;
}
.summary-footer h4 {
    margin-top: 1rem;
    font-size: 1.5rem;
    border-top: 1px solid #4a4a4a;
    padding-top: 0.5rem;
}
.main-container {
  min-height: 100vh;
  max-width: none;
  background: linear-gradient(to right, #1a1a1a, #0d0d0d);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  width: 100%;
}
.content-wrapper {
  position: relative; 
  width: 100%;
  max-width: 90rem; 
  background-color: #2e2e2e; 
  border-radius: 1.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
  padding: 1.5rem;
  color: white; 
}
.close-button {
  position: absolute; 
  top: 1.5rem; 
  right: 1.5rem; 
  background: none;
  border: none;
  color: #c0c0c0; 
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  padding: 0;
  line-height: 1; 
  transition: color 0.2s, transform 0.2s;
  z-index: 10; 
}
.close-button:hover {
  color: #f44336; 
  transform: scale(1.1);
}
.algorithm-container { padding: 0; }
.title {
  font-size: 2.5rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 3rem;
  color: #4caf50;
}
.section-text {
  font-size: 1rem;
  line-height: 1.5;
  color: #f0f0f0;
}
.input-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    margin-bottom: 2rem;
}
@media (min-width: 768px) {
    .input-grid {
        grid-template-columns: repeat(6, 1fr); 
    }
}
.input-group { display: flex; flex-direction: column; }
.input-label { font-weight: 600; margin-bottom: 0.25rem; color: #c0c0c0; }
.input-field {
    width: 100%;
    border: 1px solid #4a4a4a;
    border-radius: 0.5rem;
    padding: 0.5rem 0.75rem;
    outline: none;
    transition: box-shadow 0.2s;
    background-color: #333; 
    color: white;
}
.input-field:focus { box-shadow: 0 0 0 2px #4caf50; }
.disabled-field { background-color: #444; color: #999; }
.button-group {
  display: flex;
  align-items: flex-end;
  gap: 0.75rem;
  grid-column: span 1 / span 1; 
}
.button {
    flex: 1;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-weight: 600;
    color: black;
    border: none;
    cursor: pointer;
    transition: transform 0.2s;
}
.button:hover { transform: scale(1.05); }
.button-primary { background-color: #4caf50; }
.button-error { background-color: #d32f2f; }
.table-container {
  overflow-x: auto;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.1);
  margin-top: 2rem;
}
.data-table { width: 100%; text-align: center; border-collapse: collapse; }
.table-header { background-color: #4caf50; color: white; }
.table-header th { padding: 0.75rem 0.75rem; }
.table-row:nth-child(even) { background-color: #4a4a4a; }
.table-row:nth-child(odd) { background-color: #333333; }
.table-row:hover { background-color: #66bb6a; color: black; }
.table-row td { padding: 0.75rem 0.75rem; }
.final-capital {
    font-weight: 700;
    color: #4caf50; 
    font-size: 1.1rem;
}
.perdida-casa {
    font-weight: 700;
    color: #f44336; 
    font-size: 1.1rem;
}
</style>
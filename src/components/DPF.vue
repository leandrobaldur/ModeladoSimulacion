<template>
  <div class="main-container"> 
    
    <div class="content-wrapper"> 
      
      <button class="close-button" @click="goBackToSimulaciones">X</button>
      
      <div class="algorithm-container">
        <h2 class="title">Depósito a Plazo Fijo </h2>

        <div class="info-alert">
          <div class="section-text">
            Ingresa el capital inicial, la tasa de interés anual y la cantidad de años para calcular el crecimiento de tu DPF mediante interés compuesto, mostrando el resultado al final de cada año.
          </div>
        </div>

        <div class="input-grid">
          
          <div class="input-group">
            <label class="input-label">Capital Inicial (BS)</label>
            <input v-model.number="capital" type="number" placeholder="Ej: 1000" class="input-field" />
          </div>

          <div class="input-group">
            <label class="input-label">Tasa Anual (%)</label>
            <input v-model.number="tasaAnual" type="number" placeholder="Ej: 5.5" class="input-field" />
          </div>

          <div class="input-group">
            <label class="input-label">Tiempo (Años)</label>
            <input v-model.number="tiempoAnios" type="number" placeholder="Ej: 5" class="input-field" />
          </div>
          
          <div class="input-group">
            <label class="input-label">Interés Total Ganado</label>
            <input :value="interesTotal.toFixed(2)" type="text" disabled class="input-field disabled-field" />
          </div>

          <div class="input-group">
            <label class="input-label">Capital Final Total</label>
            <input :value="capitalFinalTotal.toFixed(2)" type="text" disabled class="input-field disabled-field" />
          </div>

          <div class="button-group">
            <button @click="simularDPFCompuesto" class="button button-primary">Simular Años</button>
          </div>
          
          <div class="button-group">
            <button @click="limpiarDatos" class="button button-error">Limpiar Datos</button>
          </div>
        </div>
        
        <div v-if="resultadosAnuales.length > 0" class="table-container">
          <table class="data-table">
            <thead class="table-header">
              <tr>
                <th>Año</th>
                <th>Capital Inicial (Bs)</th>
                <th>Interés Anual Ganado (Bs)</th>
                <th>Capital Final (Bs)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="res in resultadosAnuales" :key="res.anio" class="table-row">
                <td>{{ res.anio }}</td>
                <td>{{ res.capitalInicial.toFixed(2) }}</td>
                <td>{{ res.interesGanado.toFixed(2) }}</td>
                <td :class="{'final-capital': res.anio === tiempoAnios}">{{ res.capitalFinal.toFixed(2) }}</td>
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

interface ResultadoAnual {
  anio: number;
  capitalInicial: number;
  interesGanado: number;
  capitalFinal: number;
}

const capital = ref<number>(1000);
const tasaAnual = ref<number>(0.5);
const tiempoAnios = ref<number>(5);

const interesTotal = ref<number>(0);
const capitalFinalTotal = ref<number>(0);
const resultadosAnuales = ref<ResultadoAnual[]>([]);

function simularDPFCompuesto() {
    if (capital.value <= 0 || tasaAnual.value <= 0 || tiempoAnios.value <= 0) {
        alert('Por favor, ingresa valores positivos y válidos para Capital, Tasa y Años.');
        limpiarResultados();
        return;
    }

    const tasaDecimal = tasaAnual.value / 100;
    let capitalActual = capital.value;
    let interesAcumulado = 0;
    
    resultadosAnuales.value = [];

    // lgica de Interés Compuesto Anual
    for (let anio = 1; anio <= tiempoAnios.value; anio++) {
        
        const interesGanado = capitalActual * tasaDecimal;
      
        const capitalSiguiente = capitalActual + interesGanado;

        interesAcumulado += interesGanado;
       
        resultadosAnuales.value.push({
            anio: anio,
            capitalInicial: capitalActual,
            interesGanado: interesGanado,
            capitalFinal: capitalSiguiente,
        });

        capitalActual = capitalSiguiente;
    }

    interesTotal.value = interesAcumulado;
    capitalFinalTotal.value = capitalActual;
}

function limpiarDatos() {
    capital.value = 0;
    tasaAnual.value = 0;
    tiempoAnios.value = 0;
    limpiarResultados();
}

function limpiarResultados() {
    interesTotal.value = 0;
    capitalFinalTotal.value = 0;
    resultadosAnuales.value = [];
}

//simularDPFCompuesto();
</script>

<style scoped>

.content-wrapper {
  position: relative; /* Esencial para el posicionamiento absoluto del botón */
  width: 100%;
  max-width: 90rem; 
  background-color: #2e2e2e; 
  border-radius: 1.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
  padding: 1.5rem;
  color: white; 
}

.close-button {
  position: absolute; /* Posicionamiento absoluto dentro de .content-wrapper */
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

.main-container {
  min-height: 100vh;
  max-width: none;
  background: linear-gradient(to right, #1a1a1a, #0d0d0d);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}
.title {
  font-size: 2.5rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 3rem;
  color: #4caf50; 
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
.info-alert {
  background-color: #388e3c; 
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  padding: 1rem;
  color: white;
}
.section-text {
  font-size: 1rem;
  line-height: 1.5;
  color: #f0f0f0;
}
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
</style>
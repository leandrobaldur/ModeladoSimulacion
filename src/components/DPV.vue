<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="main-container"> 
    
    <div class="content-wrapper"> 
      
      <button class="close-button" @click="goBackToSimulaciones">X</button>
      
      <div class="algorithm-container">
        <h2 class="title">Depósito a Plazo Variable (DPV)</h2>

        <div class="info-alert">
          <div class="section-text">
            Simula el crecimiento del capital bajo interés compuesto donde la tasa de interés se determina por el capital actual al inicio de cada año. Puedes configurar los tramos de capital y la tasa de interés que aplica a cada uno.
          </div>
        </div>

        <div class="config-section">
            <h3>Configuración de Tramos de Tasa (BS)</h3>
            <div class="tramos-grid">
                
                <div v-for="(tramo, index) in tramosTasa" :key="index" class="tramo-group">
                    <div class="input-group">
                        <label class="input-label">Mín.</label>
                        <input v-model.number="tramo.minCapital" type="number" class="input-field small-input" />
                    </div>
                    <div class="input-group">
                        <label class="input-label">Máx.</label>
                        <input v-model.number="tramo.maxCapital" type="number" class="input-field small-input" :disabled="index === tramosTasa.length - 1" :placeholder="index === tramosTasa.length - 1 ? 'Sin Límite' : ''" />
                    </div>
                    <div class="input-group">
                        <label class="input-label">Tasa (%)</label>
                        <input v-model.number="tramo.tasa" type="number" class="input-field small-input" />
                    </div>
                    <button @click="eliminarTramo(index)" class="button button-error button-small" :disabled="tramosTasa.length === 1">X</button>
                </div>
                
            </div>
            <button @click="agregarTramo" class="button button-secondary">➕ Agregar Tramo</button>
        </div>
        
        <hr/>
        
        <div class="input-grid">
          
          <div class="input-group">
            <label class="input-label">Capital Inicial (BS)</label>
            <input v-model.number="capital" type="number" placeholder="Ej: 1000" class="input-field" />
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

          <div class="button-group wide-button-group">
            <button @click="simularDPV" class="button button-primary">Simular DPV</button>
            <button @click="limpiarDatos" class="button button-error">Limpiar Datos</button>
          </div>
        </div>
        
        <div v-if="resultadosAnuales.length > 0" class="table-container">
          <table class="data-table">
            <thead class="table-header">
              <tr>
                <th>Año</th>
                <th>Capital Inicial (Bs)</th>
                <th>Tasa Aplicada (%)</th>
                <th>Interés Anual Ganado (Bs)</th>
                <th>Capital Final (Bs)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="res in resultadosAnuales" :key="res.anio" class="table-row">
                <td>{{ res.anio }}</td>
                <td>{{ res.capitalInicial.toFixed(2) }}</td>
                <td class="final-capital">{{ res.tasaAplicada.toFixed(2) }}</td>
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
import { ref, reactive, watch } from 'vue';
import { useRouter } from 'vue-router'; 

const router = useRouter();
function goBackToSimulaciones() {
  router.push('/simulaciones'); 
}

interface TramoTasa {
  minCapital: number;
  maxCapital: number;
  tasa: number;
}

interface ResultadoAnual {
  anio: number;
  capitalInicial: number;
  tasaAplicada: number; 
  interesGanado: number;
  capitalFinal: number;
}

const capital = ref<number>(1000);
const tiempoAnios = ref<number>(5);

const tramosTasa = reactive<TramoTasa[]>([
  { minCapital: 0, maxCapital: 10000, tasa: 3.5 },
  { minCapital: 10000, maxCapital: 100000, tasa: 3.7 },
  { minCapital: 100000, maxCapital: Infinity, tasa: 4.0 } 
]);

watch(tramosTasa, (newTramos) => {
  for (let i = 0; i < newTramos.length; i++) {
    if (i > 0) {
      newTramos[i].minCapital = newTramos[i - 1].maxCapital;
    }
    if (i === newTramos.length - 1) {
      newTramos[i].maxCapital = Infinity;
    }
  }
}, { deep: true });

function agregarTramo() {
  const ultimoTramo = tramosTasa[tramosTasa.length - 1];
  
  const nuevoMin = ultimoTramo.maxCapital === Infinity ? ultimoTramo.minCapital + 10000 : ultimoTramo.maxCapital;
  
  ultimoTramo.maxCapital = nuevoMin; 
  
  tramosTasa.push({
    minCapital: nuevoMin,
    maxCapital: Infinity, 
    tasa: ultimoTramo.tasa + 0.1 
  });
}

function eliminarTramo(index: number) {
  if (tramosTasa.length > 1) {
    if (index === tramosTasa.length - 1 && tramosTasa.length > 1) {
      tramosTasa[tramosTasa.length - 2].maxCapital = Infinity;
    }
    tramosTasa.splice(index, 1);
  } else {
    alert("Debe haber al menos un tramo de interés.");
  }
}

const interesTotal = ref<number>(0);
const capitalFinalTotal = ref<number>(0);
const resultadosAnuales = ref<ResultadoAnual[]>([]);

function obtenerTasaVariable(montoCapital: number): number {
    const tramosOrdenados = tramosTasa.sort((a, b) => a.minCapital - b.minCapital);
    
    const tramoEncontrado = tramosOrdenados.find(tramo => 
        montoCapital >= tramo.minCapital && montoCapital < tramo.maxCapital
    );

    return tramoEncontrado ? tramoEncontrado.tasa : tramosOrdenados[tramosOrdenados.length - 1].tasa;
}

function simularDPV() {
    if (capital.value <= 0 || tiempoAnios.value <= 0) {
        alert('Por favor, ingresa valores positivos y válidos para Capital y Años.');
        limpiarResultados();
        return;
    }

    let capitalActual = capital.value;
    let interesAcumulado = 0;
    
    resultadosAnuales.value = [];

    for (let anio = 1; anio <= tiempoAnios.value; anio++) {
        
        const tasaPorcentaje = obtenerTasaVariable(capitalActual);
        const tasaDecimal = tasaPorcentaje / 100;

        const interesGanado = capitalActual * tasaDecimal;
        const capitalSiguiente = capitalActual + interesGanado;

        interesAcumulado += interesGanado;
        
        resultadosAnuales.value.push({
            anio: anio,
            capitalInicial: capitalActual,
            tasaAplicada: tasaPorcentaje,
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
    tiempoAnios.value = 0;
    limpiarResultados();
}

function limpiarResultados() {
    interesTotal.value = 0;
    capitalFinalTotal.value = 0;
    resultadosAnuales.value = [];
}

</script>

<style scoped>

.config-section {
    background-color: #333333;
    padding: 1rem; 
    border-radius: 0.75rem;
    margin-bottom: 1.5rem; 
    border: 1px solid #4caf5055;
}

.config-section h3 {
    color: #4caf50;
    margin-top: 0;
    margin-bottom: 0.8rem; 
    font-size: 1.1rem; 
}

.tramos-grid {
    display: flex;
    flex-direction: column;
    gap: 0.75rem; 
    margin-bottom: 0.8rem; 
}

.tramo-group {
    display: grid;
    grid-template-columns: repeat(3, 1fr) auto; 
    gap: 0.5rem; 
    align-items: center; 
    padding: 0.5rem; 
    background-color: #4a4a4a;
    border-radius: 0.4rem; 
}

.tramo-group .input-group {
    margin-bottom: 0;
}

.tramo-group .input-label {
    font-size: 0.75rem; 
    margin-bottom: 0.15rem; 
    color: #b0b0b0;
}

.small-input {
    padding: 0.3rem 0.5rem !important; 
    font-size: 0.85rem; 
    height: 30px; 
}

.button-secondary {
    background-color: #03a9f4;
    color: white;
    font-weight: 600;
    padding: 0.5rem 0.8rem; 
    font-size: 0.9rem; 
}

.button-small {
    padding: 0.4rem 0.6rem; 
    height: 30px;
    align-self: flex-end; 
    font-size: 0.85rem; 
}

@media (min-width: 768px) {
    .tramos-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); 
        gap: 1rem;
    }
    .tramo-group {
        grid-template-columns: 1fr 1fr 1fr auto;
    }
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

.wide-button-group {
    grid-column: span 2;
}

@media (min-width: 768px) {
  .input-grid {
    grid-template-columns: repeat(4, 1fr); 
  }
  .wide-button-group {
    grid-column: span 2;
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

hr {
    border: 0;
    height: 1px;
    background-image: linear-gradient(to right, rgba(0, 0, 0, 0), #4caf50, rgba(0, 0, 0, 0));
    margin: 2rem 0;
}
</style>
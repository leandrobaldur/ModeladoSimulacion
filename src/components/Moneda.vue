<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="main-container"> 
    
    <div class="content-wrapper"> 
      
      <button class="close-button" @click="goBackToSimulaciones">X</button>
      
      <div class="algorithm-container">
        <h2 class="title">Simulador de Lanzamiento de Moneda </h2>

        <div class="info-alert">
          <div class="section-text">
            Simula el lanzamiento de una moneda la probabilidad es de 50% para Cara o Escudo.
          </div>
        </div>

        <div class="input-grid">
          
          <div class="input-group">
            <label class="input-label">Número de Lanzamientos (N)</label>
            <input v-model.number="numLanzamientos" type="number" placeholder="Ej: 1000" class="input-field" />
          </div>

          <div class="input-group">
            <label class="input-label">Veces Cara (Totales)</label>
            <input :value="resultados.totalCara" type="text" disabled class="input-field disabled-field" />
          </div>
          
          <div class="input-group">
            <label class="input-label">Veces Escudo (Totales)</label>
            <input :value="resultados.totalEscudo" type="text" disabled class="input-field disabled-field" />
          </div>

          <div class="input-group">
            <label class="input-label">Frecuencia Cara (%)</label>
            <input :value="resultados.promedioCara.toFixed(2)" type="text" disabled class="input-field disabled-field" />
          </div>

          <div class="input-group">
            <label class="input-label">Frecuencia Escudo (%)</label>
            <input :value="resultados.promedioEscudo.toFixed(2)" type="text" disabled class="input-field disabled-field" />
          </div>

          <div class="button-group wide-button-group">
            <button @click="simularLanzamientos" class="button button-primary">Simular {{ numLanzamientos }} Veces</button>
            <button @click="limpiarDatos" class="button button-error">Limpiar Datos</button>
          </div>
        </div>
        
        <div v-if="lanzamientos.length > 0" class="table-container">
            <h3>Últimos 20 Lanzamientos Registrados</h3>
          <table class="data-table">
            <thead class="table-header">
              <tr>
                <th>N°</th>
                <th>Resultado</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="l in lanzamientos.slice(-20)" :key="l.id" class="table-row">
                <td>{{ l.id }}</td>
                <td :class="{'final-capital': l.resultado === 'Cara', 'perdida-casa': l.resultado === 'Escudo'}">{{ l.resultado }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router'; 

const router = useRouter();
function goBackToSimulaciones() {
  router.push('/simulaciones'); 
}

interface ResultadoLanzamiento {
  id: number;
  resultado: 'Cara' | 'Escudo';
}

const numLanzamientos = ref<number>(1000);

const resultados = reactive({
    totalCara: 0,
    totalEscudo: 0,
    promedioCara: 0.0,
    promedioEscudo: 0.0,
});

const lanzamientos = ref<ResultadoLanzamiento[]>([]);

function lanzarMoneda(): 'Cara' | 'Escudo' {
    return Math.random() < 0.5 ? 'Cara' : 'Escudo';
}

function simularLanzamientos() {
    if (numLanzamientos.value <= 0 || numLanzamientos.value > 1000000) {
        alert('Por favor, ingresa un número de lanzamientos positivo y razonable (máx. 1,000,000).');
        limpiarResultados();
        return;
    }

    resultados.totalCara = 0;
    resultados.totalEscudo = 0;
    lanzamientos.value = [];
    
    for (let i = 1; i <= numLanzamientos.value; i++) {
        const resultado = lanzarMoneda();

        if (resultado === 'Cara') {
            resultados.totalCara++;
        } else {
            resultados.totalEscudo++;
        }
       
        if (numLanzamientos.value <= 1000) { 
            lanzamientos.value.push({
                id: i,
                resultado: resultado,
            });
        }
    }

    if (numLanzamientos.value > 0) {
        resultados.promedioCara = (resultados.totalCara / numLanzamientos.value) * 100;
        resultados.promedioEscudo = (resultados.totalEscudo / numLanzamientos.value) * 100;
    }
}

function limpiarDatos() {
    numLanzamientos.value = 1000;
    limpiarResultados();
}

function limpiarResultados() {
    resultados.totalCara = 0;
    resultados.totalEscudo = 0;
    resultados.promedioCara = 0.0;
    resultados.promedioEscudo = 0.0;
    lanzamientos.value = [];
}
</script>

<style scoped>

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
    grid-template-columns: repeat(6, 1fr); 
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
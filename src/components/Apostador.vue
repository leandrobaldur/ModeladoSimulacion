<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="main-container"> 
    
    <div class="content-wrapper"> 
      
      <button class="close-button" @click="goBackToSimulaciones">X</button>
      
      <div class="algorithm-container">
        
        <h2 class="title">Juego de Dados </h2>

        <div class="info-alert">
          <p class="section-text">
            Simula un juego de dados con {{ costoJuego }} Bs de entrada y un premio de {{ premioPorGanar }} Bs si el lanzamiento suma 7.
          </p>
        </div>

        <div class="input-grid">
          
          <div class="input-group">
            <label class="input-label">Número de Lanzamientos (N)</label>
            <input v-model.number="numLanzamientos" type="number" placeholder="Ej: 1000" class="input-field" />
          </div>
          <div class="input-group">
            <label class="input-label">Costo de Ingreso (Bs)</label>
            <input v-model.number="costoJuego" type="number" placeholder="Ej: 2" class="input-field" />
          </div>
          <div class="input-group">
            <label class="input-label">Premio por 7 (Bs)</label>
            <input v-model.number="premioPorGanar" type="number" placeholder="Ej: 5" class="input-field" />
          </div>
          <div class="input-group">
            <label class="input-label">Ganancia Neta Casa (Bs)</label>
            <input :value="gananciaNetaCasa.toFixed(2)" type="text" disabled class="input-field disabled-field" />
          </div>
          <div class="input-group">
            <label class="input-label">Juegos Ganados (Casa)</label>
            <input :value="juegosGanadosCasa" type="text" disabled class="input-field disabled-field" />
          </div>
          <div class="input-group">
            <label class="input-label">% Juegos Ganados (Casa)</label>
            <input :value="porcentajeCasa.toFixed(2) + '%'" type="text" disabled class="input-field disabled-field" />
          </div>

          <div class="button-group">
            <button @click="simularDados" class="button button-primary">Simular Lanzamientos</button>
          </div>
          <div class="button-group">
            <button @click="limpiarDatos" class="button button-error">Limpiar Datos</button>
          </div>
        </div>
        
        <div v-if="resultadosLanzamientos.length > 0" class="table-container">
          <table class="data-table">
            <thead class="table-header">
              <tr>
                <th>Lanzamiento</th>
                <th>Dado 1</th>
                <th>Dado 2</th>
                <th>Suma</th>
                <th>Resultado</th>
                <th>Ganancia Casa (Bs)</th>
                <th>Ganancia Acumulada (Bs)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="res in resultadosLanzamientos" :key="res.lanzamiento" class="table-row">
                <td>{{ res.lanzamiento }}</td>
                <td>{{ res.dado1 }}</td>
                <td>{{ res.dado2 }}</td>
                <td>{{ res.suma }}</td>
                <td>{{ res.resultado }}</td>
                <td>{{ res.gananciaRonda.toFixed(2) }}</td>
                <td :class="{'final-capital': res.gananciaAcumulada >= 0, 'perdida-casa': res.gananciaAcumulada < 0}">
                  {{ res.gananciaAcumulada.toFixed(2) }}
                </td>
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

interface ResultadoLanzamiento {
  lanzamiento: number;
  dado1: number;
  dado2: number;
  suma: number;
  resultado: string; 
  gananciaRonda: number; 
  gananciaAcumulada: number;
}

const numLanzamientos = ref<number>(100);
const costoJuego = ref<number>(2); 
const premioPorGanar = ref<number>(5); 

const gananciaNetaCasa = ref<number>(0);
const juegosGanadosCasa = ref<number>(0);
const porcentajeCasa = ref<number>(0);
const resultadosLanzamientos = ref<ResultadoLanzamiento[]>([]);

function lanzarDado(): number {
    return Math.floor(Math.random() * 6) + 1;
}

function simularDados() {
    if (numLanzamientos.value <= 0 || costoJuego.value <= 0 || premioPorGanar.value <= 0) {
        alert('Por favor, ingresa valores positivos válidos para todos los campos.');
        limpiarResultados();
        return;
    }

    resultadosLanzamientos.value = [];
    let gananciaAcumulada = 0;
    let victoriasCasa = 0;

    for (let i = 1; i <= numLanzamientos.value; i++) {
        const dado1 = lanzarDado();
        const dado2 = lanzarDado();
        const suma = dado1 + dado2;
        
        let gananciaRonda = 0; 
        let resultado = '';

        if (suma === 7) {
            gananciaRonda = costoJuego.value - premioPorGanar.value; 
            resultado = 'Gana Apostador (7)';
        } else {
            gananciaRonda = costoJuego.value; 
            resultado = 'Gana Casa';
            victoriasCasa++;
        }
        
        gananciaAcumulada += gananciaRonda;

        resultadosLanzamientos.value.push({
            lanzamiento: i,
            dado1: dado1,
            dado2: dado2,
            suma: suma,
            resultado: resultado,
            gananciaRonda: gananciaRonda,
            gananciaAcumulada: gananciaAcumulada,
        });
    }

    gananciaNetaCasa.value = gananciaAcumulada;
    juegosGanadosCasa.value = victoriasCasa;
    porcentajeCasa.value = (victoriasCasa / numLanzamientos.value) * 100;
}

function limpiarDatos() {
    numLanzamientos.value = 0;
    costoJuego.value = 2; 
    premioPorGanar.value = 5; 
    limpiarResultados();
}

function limpiarResultados() {
    gananciaNetaCasa.value = 0;
    juegosGanadosCasa.value = 0;
    porcentajeCasa.value = 0;
    resultadosLanzamientos.value = [];
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
  position: absolute; /* Posicionamiento absoluto dentro de .content-wrapper */
  top: 1.5rem; /* Ajustar posición superior */
  right: 1.5rem; /* Ajustar posición derecha */
  background: none;
  border: none;
  color: #d10000; /* Gris claro */
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  padding: 0;
  line-height: 1; /* Asegura que la X no se desplace */
  transition: color 0.2s, transform 0.2s;
  z-index: 10; /* Asegurar que esté por encima de otros elementos */
}

.close-button:hover {
  color: #f44336; /* Rojo al pasar el mouse */
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
  width: 100%;
}
.algorithm-container { padding: 0; }
.title {
  font-size: 2.5rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 3rem;
  color: #4caf50;
}
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
@media (max-width: 767px) {
    .button-group:nth-child(4), .button-group:nth-child(5) {
        grid-column: span 1;
    }
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
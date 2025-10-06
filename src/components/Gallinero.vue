<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="main-container"> 
    
    <div class="content-wrapper"> 
      
      <button class="close-button" @click="goBackToSimulaciones">X</button>
      
      <div class="algorithm-container">
        
        <h2 class="title">Gallinero</h2>

        <div class="info-alert">
          <div class="section-text">
            Simula el proceso de la gallina durante {{ diasSimulados }} días:
            <ul>
              <li>Producción: La gallina pone huevos a razón de media = 1 huevo/día (Poisson).</li>
              <li>Probabilidad de Resultados del Huevo: Roto 0.2%, Pollo 0.3%, Permanece Huevo 0.5%.</li>
              <li>Supervivencia del Pollo: Muere 0.2%, Sobrevive 0.8%.</li>
              <li>Ingreso: Huevo a {{ precioHuevo }} Bs, Pollo Sobreviviente a {{ precioPollo }} Bs.</li>
            </ul>
          </div>
        </div>

        <div class="input-grid">
          
          <div class="input-group">
            <label class="input-label">Días a Simular</label>
            <input v-model.number="diasSimulados" type="number" placeholder="30" class="input-field" />
          </div>

          <div class="input-group">
            <label class="input-label">Precio Huevo Bs</label>
            <input v-model.number="precioHuevo" type="number" placeholder="1.50" class="input-field" />
          </div>

          <div class="input-group">
            <label class="input-label">Precio Pollo Bs</label>
            <input v-model.number="precioPollo" type="number" placeholder="5.00" class="input-field" />
          </div>

          <div class="input-group">
            <label class="input-label">Ingreso Neto Total Bs</label>
            <input :value="ingresoNetoTotal.toFixed(2)" type="text" disabled class="input-field disabled-field" />
          </div>

          <div class="input-group">
            <label class="input-label">Ingreso Promedio Diario Bs</label>
            <input :value="ingresoPromedioDiario.toFixed(2)" type="text" disabled class="input-field disabled-field" />
          </div>
          
          <div class="button-group">
            <button @click="simularGallinero" class="button button-primary">Simular </button>
          </div>
          
          <div class="button-group">
            <button @click="limpiarResultados" class="button button-error">Limpiar</button>
          </div>
        </div>

        <div v-if="ingresoNetoTotal > 0" class="summary-footer">
            <h4>RESULTADOS ACUMULADOS EN {{ diasSimulados }} DÍAS</h4>
            <p>Total de Huevos Puestos: {{ resultadosTotales.totalHuevosPuestos }}</p>
            <p>Huevos Vendidos (Permanecen): {{ resultadosTotales.totalPermaneceHuevo }}</p>
            <p>Huevos Rotos: {{ resultadosTotales.totalRotos }}</p>
            <p>Pollos Sobrevivientes Vendidos: {{ resultadosTotales.totalPollosSobrevivientes }}</p>
            <p class="summary-highlight">Ingreso Neto Final: {{ ingresoNetoTotal.toFixed(2) }} Bs</p>
            <p class="summary-highlight">Ingreso Promedio Diario: {{ ingresoPromedioDiario.toFixed(2) }} Bs</p>
        </div>
        
        <div v-if="resultadosDiarios.length > 0" class="table-container">
          <table class="data-table">
            <thead class="table-header">
              <tr>
                <th>Día</th>
                <th>Huevos Puestos</th>
                <th>Rotos</th>
                <th>Pollos nacidos</th>
                <th>Sobrevivientes</th>
                <th>Permanece huevo</th>
                <th>Ingreso Día Bs</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="res in resultadosDiarios" :key="res.dia" class="table-row">
                <td>{{ res.dia }}</td>
                <td>{{ res.huevosPuestos }}</td>
                <td>{{ res.rotos }}</td>
                <td>{{ res.pollosNacidos }}</td>
                <td>{{ res.pollosSobrevivientes }}</td>
                <td>{{ res.permaneceHuevo }}</td>
                <td :class="{'final-capital': res.ingresoDia >= 0, 'perdida-casa': res.ingresoDia < 0}">
                    {{ res.ingresoDia.toFixed(2) }}
                </td>
              </tr>
              <tr class="table-row final-summary-row">
                  <td>TOTAL</td>
                  <td>{{ resultadosTotales.totalHuevosPuestos }}</td>
                  <td>{{ resultadosTotales.totalRotos }}</td>
                  <td>{{ resultadosTotales.totalPollosNacidos }}</td>
                  <td>{{ resultadosTotales.totalPollosSobrevivientes }}</td>
                  <td>{{ resultadosTotales.totalPermaneceHuevo }}</td>
                  <td>{{ ingresoNetoTotal.toFixed(2) }}</td>
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

interface ResultadoDia {
  dia: number;
  huevosPuestos: number;
  rotos: number;
  pollosNacidos: number;
  pollosSobrevivientes: number;
  permaneceHuevo: number;
  ingresoDia: number;
}

interface ResultadosTotales {
  totalHuevosPuestos: number;
  totalRotos: number;
  totalPollosNacidos: number;
  totalPollosSobrevivientes: number;
  totalPermaneceHuevo: number;
}

const diasSimulados = ref<number>(30);
const precioHuevo = ref<number>(1.50);
const precioPollo = ref<number>(5.00);
const ingresoNetoTotal = ref<number>(0);
const ingresoPromedioDiario = ref<number>(0);
const resultadosDiarios = ref<ResultadoDia[]>([]);
const resultadosTotales = reactive<ResultadosTotales>({
  totalHuevosPuestos: 0,
  totalRotos: 0,
  totalPollosNacidos: 0,
  totalPollosSobrevivientes: 0,
  totalPermaneceHuevo: 0,
});

function generarHuevosPoisson(): number {
    const R = Math.random();
    if (R < 0.3679) return 0;
    if (R < 0.7358) return 1; 
    if (R < 0.9197) return 2; 
    if (R < 0.9810) return 3; 
    return 4; 
}

function procesarHuevo(): { rotos: number, pollosNacidos: number, pollosSobrevivientes: number, permaneceHuevo: number } {
    const R1 = Math.random();
    let rotos = 0;
    let pollosNacidos = 0;
    let pollosSobrevivientes = 0;
    let permaneceHuevo = 0;
    if (R1 < 0.2) {
        rotos = 1;
    } else if (R1 < 0.5) { 
        pollosNacidos = 1;
        const R2 = Math.random();
        if (R2 < 0.2) {
        } else {
            pollosSobrevivientes = 1;
        }
    } else {
        permaneceHuevo = 1;
    }
    
    return { rotos, pollosNacidos, pollosSobrevivientes, permaneceHuevo };
}

function simularGallinero() {
    if (diasSimulados.value <= 0 || precioHuevo.value < 0 || precioPollo.value < 0) {
        alert('Por favor, ingresa valores positivos válidos para Días y Precios.');
        limpiarResultados();
        return;
    }
    
    limpiarTotales();

    for (let dia = 1; dia <= diasSimulados.value; dia++) {

        const huevosPuestos = generarHuevosPoisson();
        let rotosDia = 0;
        let pollosNacidosDia = 0;
        let pollosSobrevivientesDia = 0;
        let permaneceHuevoDia = 0;
        
        for (let h = 0; h < huevosPuestos; h++) {
            const resultado = procesarHuevo();
            rotosDia += resultado.rotos;
            pollosNacidosDia += resultado.pollosNacidos;
            pollosSobrevivientesDia += resultado.pollosSobrevivientes;
            permaneceHuevoDia += resultado.permaneceHuevo;
        }

        const ingresoHuevo = permaneceHuevoDia * precioHuevo.value;
        const ingresoPollo = pollosSobrevivientesDia * precioPollo.value;
        const ingresoDia = ingresoHuevo + ingresoPollo;
        
        resultadosTotales.totalHuevosPuestos += huevosPuestos;
        resultadosTotales.totalRotos += rotosDia;
        resultadosTotales.totalPollosNacidos += pollosNacidosDia;
        resultadosTotales.totalPollosSobrevivientes += pollosSobrevivientesDia;
        resultadosTotales.totalPermaneceHuevo += permaneceHuevoDia;
        ingresoNetoTotal.value += ingresoDia;

        resultadosDiarios.value.push({
            dia: dia,
            huevosPuestos: huevosPuestos,
            rotos: rotosDia,
            pollosNacidos: pollosNacidosDia,
            pollosSobrevivientes: pollosSobrevivientesDia,
            permaneceHuevo: permaneceHuevoDia,
            ingresoDia: ingresoDia,
        });
    }
    ingresoPromedioDiario.value = ingresoNetoTotal.value / diasSimulados.value;
}

function limpiarTotales() {
    ingresoNetoTotal.value = 0;
    ingresoPromedioDiario.value = 0;
    resultadosDiarios.value = [];
    resultadosTotales.totalHuevosPuestos = 0;
    resultadosTotales.totalRotos = 0;
    resultadosTotales.totalPollosNacidos = 0;
    resultadosTotales.totalPollosSobrevivientes = 0;
    resultadosTotales.totalPermaneceHuevo = 0;
}

function limpiarResultados() {
    diasSimulados.value = 30;
    precioHuevo.value = 1.50;
    precioPollo.value = 5.00;
    limpiarTotales();
}
</script>

<style scoped>

@media (min-width: 768px) {
    .input-grid {
        grid-template-columns: repeat(6, 1fr); 
    }
}
.summary-footer {
    margin-top: 1.5rem;
    padding: 1rem;
    background-color: #333;
    border-radius: 0.5rem;
}
.summary-footer h4 {
    color: #4caf50;
    font-size: 1.4rem;
    margin-bottom: 1rem;
}
.summary-footer p {
    margin: 0.5rem 0;
    font-size: 1rem;
    color: #c0c0c0;
}
.summary-highlight {
    font-size: 1.2rem !important;
    font-weight: bold;
    color: #4caf50 !important;
    border-top: 1px solid #4a4a4a;
    padding-top: 0.5rem;
    margin-top: 1rem !important;
}

.content-wrapper { position: relative; }
.close-button {
  position: absolute; top: 1.5rem; right: 1.5rem; background: none; border: none;
  color: #c0c0c0; font-size: 1.5rem; font-weight: bold; cursor: pointer;
  padding: 0; line-height: 1; transition: color 0.2s, transform 0.2s; z-index: 10; 
}
.close-button:hover { color: #f44336; transform: scale(1.1); }

.final-summary-row {
    background-color: #388e3c !important; 
    font-weight: bold;
    color: white;
    border-top: 3px solid #4caf50;
}

.main-container { min-height: 100vh; max-width: none; background: linear-gradient(to right, #1a1a1a, #0d0d0d); display: flex; align-items: center; justify-content: center; padding: 1.5rem; width: 100%; }
.content-wrapper { width: 100%; max-width: 90rem; background-color: #2e2e2e; border-radius: 1.5rem; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2); padding: 1.5rem; color: white; }
.title { font-size: 2.5rem; font-weight: 800; text-align: center; margin-bottom: 3rem; color: #4caf50; }
.info-alert { background-color: #388e3c; border-radius: 0.5rem; margin-bottom: 2rem; padding: 1rem; color: white; }
.section-text { font-size: 1rem; line-height: 1.5; color: #f0f0f0; }
.section-text ul { margin: 0.5rem 0 0 1rem; padding: 0; list-style-type: disc; }
.section-text li { margin-bottom: 0.25rem; }
.input-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 2rem; }
.input-group { display: flex; flex-direction: column; }
.input-label { font-weight: 600; margin-bottom: 0.25rem; color: #c0c0c0; }
.input-field { width: 100%; border: 1px solid #4a4a4a; border-radius: 0.5rem; padding: 0.5rem 0.75rem; outline: none; transition: box-shadow 0.2s; background-color: #333; color: white; }
.disabled-field { background-color: #444; color: #999; }
.button-group { display: flex; align-items: flex-end; gap: 0.75rem; grid-column: span 1 / span 1; }
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
<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="main-container">
    <div class="content-wrapper">
      <h1 class="title">Algoritmo Lineal - Generador de Números</h1>

      <div class="input-grid">
        <div class="input-group">
          <label class="input-label">X₀</label>
          <input v-model.number="x0" type="number" placeholder="Semilla inicial" class="input-field" />
        </div>
        <div class="input-group">
          <label class="input-label">K</label>
          <input v-model.number="k" type="number" placeholder="Multiplicador" class="input-field" />
        </div>
        <div class="input-group">
          <label class="input-label">C</label>
          <input v-model.number="c" type="number" placeholder="Primo relativo a m" class="input-field" />
        </div>
        <div class="input-group">
          <label class="input-label">P</label>
          <input v-model.number="p" type="number" placeholder="Periodo" class="input-field" />
        </div>
        <div class="input-group">
          <label class="input-label">D (decimales)</label>
          <input v-model.number="d" type="number" placeholder="Número de decimales" class="input-field" />
        </div>
        <div class="button-group">
          <button @click="generar" class="button button-primary">Generar</button>
          <button @click="limpiar" class="button button-error">Limpiar</button>
        </div>
      </div>

      <div v-if="parametros" class="info-alert">
        <div class="info-content">
          <span><span class="font-bold">a:</span> {{ parametros.a }}</span>
          <span><span class="font-bold">c:</span> {{ parametros.c }}</span>
          <span><span class="font-bold">g:</span> {{ parametros.g.toFixed(2) }}</span>
          <span><span class="font-bold">m:</span> {{ parametros.m }}</span>
        </div>
      </div>

      <div v-if="resultados.length" class="table-container">
        <table class="data-table">
          <thead class="table-header">
            <tr>
              <th>i</th>
              <th>Xᵢ₋₁</th>
              <th>Operación</th>
              <th>Xᵢ</th>
              <th>rᵢ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(fila, index) in resultados" :key="index" class="table-row">
              <td>{{ fila.i }}</td>
              <td>{{ fila.x_prev }}</td>
              <td class="operation-cell">{{ fila.operacion }}</td>
              <td>{{ fila.xi }}</td>
              <td>{{ fila.ri }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

type Parametros = { a: number; c: number; g: number; m: number };
type Fila = { i: number; x_prev: number; operacion: string; xi: number; ri: string };

const x0 = ref<number>(2);
const k = ref<number>(3);
const c = ref<number>(7);
const p = ref<number>(8);
const d = ref<number>(4);

const parametros = ref<Parametros | null>(null);
const resultados = ref<Fila[]>([]);

function generar(): void {
  resultados.value = [];

  if (!Number.isInteger(d.value) || d.value <= 0) {
    alert("D debe ser un entero positivo (número de decimales).");
    return;
  }
  if (!Number.isInteger(p.value) || p.value <= 0) {
    alert("P debe ser un entero positivo.");
    return;
  }
  if (x0.value < 0) {
    alert("X₀ no puede ser un número negativo.");
    return;
  }
  if (k.value < 0) {
    alert("K no puede ser un número negativo.");
    return;
  }
  if (c.value < 0) {
    alert("C no puede ser un número negativo.");
    return;
  }

  const a = 1 + 4 * k.value;
  const pValue = p.value;
  const g = Math.log(pValue) / Math.log(2);
  const m = Math.pow(2, g);

  parametros.value = { a, c: c.value, g, m };

  let xi_prev = x0.value;

  for (let i = 1; i <= p.value+1; i++) {
    const xi = (a * xi_prev + c.value) % m;
    const ri = (xi / m).toFixed(d.value); 
    const operacion = `(${a} * ${xi_prev} + ${c.value}) MOD ${m}`;

    resultados.value.push({ i, x_prev: xi_prev, operacion, xi, ri });

    xi_prev = xi;
  }
}

function limpiar(): void {
  resultados.value = [];
  parametros.value = null;
}
</script>

<style scoped>

html, body {
  margin: 0;
  padding: 0;
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

.content-wrapper {
  width: 100%;
  max-width: 72rem;
  background-color: #2e2e2e; 
  border-radius: 1.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
  padding: 1.5rem;
  color: white; 
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

.input-group {
  display: flex;
  flex-direction: column;
}

.input-label {
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: #c0c0c0; 
}

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
.input-field:focus {
  box-shadow: 0 0 0 2px #4caf50;
}

.button-group {
  display: flex;
  align-items: flex-end;
  gap: 0.75rem;
  grid-column: span 1 / span 1;
}
@media (min-width: 768px) {
  .button-group {
    grid-column: span 1 / span 1;
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
.button:hover {
  transform: scale(1.05);
}

.button-primary {
  background-color: #4caf50; 
}
.button-error {
  background-color: #d32f2f; 
}

.info-alert {
  background-color: #388e3c; 
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  padding: 1rem;
  color: white;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
@media (min-width: 768px) {
  .info-content {
    flex-direction: row;
    gap: 1.5rem;
  }
}

.font-bold {
  font-weight: 700;
}

.table-container {
  overflow-x: auto;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.1);
}

.data-table {
  width: 100%;
  text-align: center;
  border-collapse: collapse;
}

.table-header {
  background-color: #4caf50; 
  color: white;
}
.table-header th {
  padding: 0.75rem 0.75rem;
}

.table-row {
  transition: background-color 0.2s;
}
.table-row:nth-child(even) {
  background-color: #4a4a4a; 
}
.table-row:nth-child(odd) {
  background-color: #333333; 
}
.table-row:hover {
  background-color: #66bb6a; 
  color: black;
}
.table-row td {
  padding: 0.75rem 0.75rem;
}

.operation-cell {
  font-family: monospace;
  font-size: 0.875rem;
  word-break: break-all;
}
</style>
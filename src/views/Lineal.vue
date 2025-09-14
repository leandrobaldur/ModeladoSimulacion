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
          <input v-model.number="c" type="number" placeholder="Constante" class="input-field" />
        </div>
        <div class="input-group">
          <label class="input-label">P</label>
          <input v-model.number="p" type="number" placeholder="Potencia de 2" class="input-field" />
        </div>
        <div class="input-group">
          <label class="input-label">D (iter.)</label>
          <input v-model.number="d" type="number" placeholder="Número de iteraciones" class="input-field" />
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
          <span><span class="font-bold">g:</span> {{ parametros.g }}</span>
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
              <td>{{ fila.ri.toFixed(4) }}</td>
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
type Fila = { i: number; x_prev: number; operacion: string; xi: number; ri: number };

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
    alert("D debe ser un entero positivo (número de iteraciones).");
    return;
  }
  if (!Number.isInteger(p.value) || p.value <= 0) {
    alert("P debe ser un entero positivo.");
    return;
  }

  const a = 1 + 4 * k.value;
  const m = Math.pow(2, p.value);
  const g = k.value;

  parametros.value = { a, c: c.value, g, m };

  let xi_prev = x0.value;

  for (let i = 1; i <= d.value; i++) {
    const xi = (a * xi_prev + c.value) % m;
    const ri = xi / m;
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
/* Contenedor principal para centrar el contenido */
.main-container {
  min-height: 100vh;
  background: linear-gradient(to right, #e0f2fe, #eef2ff);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

/* Contenedor principal del formulario y la tabla */
.content-wrapper {
  width: 100%;
  max-width: 72rem;
  background-color: white;
  border-radius: 1.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  padding: 2.5rem;
}

/* Estilos del título */
.title {
  font-size: 2.5rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 3rem;
  color: #2563eb;
}

/* Grid para los inputs */
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
}

.input-field {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  outline: none;
  transition: box-shadow 0.2s;
}
.input-field:focus {
  box-shadow: 0 0 0 2px #93c5fd;
}

/* Grupo de botones */
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
  color: white;
  border: none;
  cursor: pointer;
  transition: transform 0.2s;
}
.button:hover {
  transform: scale(1.05);
}

.button-primary {
  background-color: #3b82f6;
}
.button-error {
  background-color: #ef4444;
}

/* Estilos de la alerta de parámetros */
.info-alert {
  background-color: #dbeafe;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  margin-bottom: 2rem;
  padding: 1rem;
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

/* Estilos de la tabla */
.table-container {
  overflow-x: auto; /* Corrección aquí */
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.data-table {
  width: 100%;
  text-align: center;
  border-collapse: collapse;
}

.table-header {
  background-color: #2563eb;
  color: white;
}
.table-header th {
  padding: 0.75rem 0.75rem;
}

.table-row {
  transition: background-color 0.2s;
}
.table-row:nth-child(even) {
  background-color: #f3f4f6;
}
.table-row:hover {
  background-color: #eff6ff;
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
<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="main-container">
    <div class="content-wrapper">
      <h1 class="title">Alumno: Leandro Colque Palacios</h1>
      
      <div class="info-alert">
        <h2 class="section-title">Modelado y Simulación</h2>
        <p class="section-text">
          Este proyecto simula algoritmos para generar números pseudoaleatorios, una herramienta clave en el modelado de sistemas complejos.
        </p>
      </div>

      <div class="button-container">
        <router-link to="/lineal" class="button button-primary">
          Ir a Algoritmo Lineal
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

// Script mínimo para un componente de Vue.
</script>

<style scoped>
/* Contenedor principal para centrar el contenido */
.main-container {
  min-height: 100vh;
  background: linear-gradient(to right, #1a1a1a, #0d0d0d);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

/* Contenedor principal del formulario y la tabla */
.content-wrapper {
  width: 100%;
  max-width: 48rem; /* Tamaño más compacto */
  background-color: #2e2e2e;
  border-radius: 1.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
  padding: 2.5rem;
  color: white;
  text-align: center;
}

/* Estilos del título */
.title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 2rem;
  color: #4caf50;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #c0c0c0;
  margin-bottom: 0.5rem;
}

.section-text {
  font-size: 1rem;
  line-height: 1.6;
  color: #a0a0a0;
  margin-bottom: 0;
}

.info-alert {
  background-color: #388e3c;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  padding: 1.5rem;
}

.button-container {
  margin-top: 3rem;
}

.button {
  display: inline-block;
  padding: 0.75rem 2rem;
  border-radius: 0.5rem;
  font-weight: 600;
  color: black;
  border: none;
  cursor: pointer;
  transition: transform 0.2s;
  text-decoration: none;
}
.button:hover {
  transform: scale(1.05);
}

.button-primary {
  background-color: #4caf50;
}
</style>
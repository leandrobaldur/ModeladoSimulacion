<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="main-container">
    <div class="content-wrapper">
      <h1 class="title">Modelado y Simulación de Sistemas</h1>
      
      <div class="header-info">
        <h2 class="section-title">Generación de Números Pseudoaleatorios y Aplicaciones</h2>
        <p class="section-text">
          Este proyecto explora la generación de números pseudoaleatorios mediante métodos congruenciales y su aplicación en simulaciones financieras y operacionales.
        </p>
      </div>

      <div class="simulations-grid">
        
        <router-link to="/lineal" class="simulation-card lineal-theme">
          <div class="icon-container">
            <span class="material-icons">straighten</span>
          </div>
          <h3 class="card-title">Congruencial Lineal</h3>
          <p class="card-description">Implementación del generador lineal y análisis de periodos.</p>
        </router-link>

        <router-link to="/multiplicativo" class="simulation-card mult-theme">
          <div class="icon-container">
            <span class="material-icons">scatter_plot</span>
          </div>
          <h3 class="card-title">Congruencial Multiplicativo</h3>
          <p class="card-description">Generador enfocado en el factor multiplicativo.</p>
        </router-link>

        <router-link to="/simulaciones" class="simulation-card app-theme">
          <div class="icon-container">
            <span class="material-icons">trending_up</span>
          </div>
          <h3 class="card-title">Simulaciones (DPF, Tienda, Dados)</h3>
          <p class="card-description">Aplicaciones prácticas de los números aleatorios en finanzas y negocios.</p>
        </router-link>

      </div>
      
      <p class="footer-text">
        Alumno: Leandro Colque Palacios
      </p>

    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>

.simulations-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr); 
  gap: 2rem; 
  margin-top: 4rem;
  margin-bottom: 3rem;
}

@media (min-width: 768px) {
  .simulations-grid {
    grid-template-columns: repeat(3, 1fr); 
  }
}

.simulation-card {
  background-color: #3e3e3e; 
  border-radius: 1.5rem; 
  padding: 2rem;
  text-decoration: none;
  color: white; 
  text-align: center;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out, background-color 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.4);
}

.simulation-card:hover {
  transform: translateY(-8px) scale(1.05); 
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.6);
  color: black;
}

.lineal-theme:hover { background-color: #00bcd4; } 
.mult-theme:hover { background-color: #ffc107; } 
.app-theme:hover { background-color: #4caf50; }  

.icon-container {
  font-size: 4rem; 
  margin-bottom: 1rem;
  color: #c0c0c0; 
  transition: color 0.3s ease-in-out;
}

.simulation-card:hover .icon-container {
  color: white; 
}

.card-title {
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: white;
}

.card-description {
  font-size: 1rem;
  color: #a0a0a0;
  line-height: 1.4;
}

.simulation-card:hover .card-description,
.simulation-card:hover .card-title {
    color: black; 
}

.main-container {
  min-height: 100vh;
  background: linear-gradient(to right, #1a1a1a, #0d0d0d);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.content-wrapper {
  width: 100%;
  max-width: 90rem;
  background-color: #2e2e2e;
  border-radius: 2rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
  padding: 3rem; 
  color: white;
  text-align: center;
}

.title {
  font-size: 3.5rem;
  font-weight: 900;
  margin-bottom: 1rem;
  color: #4caf50;
  text-shadow: 0 0 10px rgba(76, 175, 80, 0.5);
}

.header-info {
    margin-bottom: 3rem;
    padding: 1.5rem;
    background-color: #388e3c33; 
    border-radius: 1rem;
    border-left: 5px solid #4caf50;
}

.section-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #c0c0c0;
  margin-bottom: 0.5rem;
}

.section-text {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #a0a0a0;
  margin-bottom: 0;
}

.footer-text {
    margin-top: 4rem;
    font-size: 1rem;
    color: #616161; 
}
</style>
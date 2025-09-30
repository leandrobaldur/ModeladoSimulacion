<!-- eslint-disable vue/multi-word-component-names -->
 <template>
  <div class="main-container">
    <div class="content-wrapper">
      <h1 class="title">Simulaciones Disponibles</h1>
      
      <div class="nav-container">
        <RouterLink to="/dpf" class="nav-button">
          DPF
        </RouterLink>
        <RouterLink to="/apostador" class="nav-button">
          Apostador
        </RouterLink>
        <RouterLink to="/tienda" class="nav-button nav-disabled">
          Tienda
        </RouterLink>
      </div>

      <div class="simulacion-content">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
</script>

<style scoped>
/* NOTA: Usa el mismo CSS de tu proyecto para mantener la coherencia */

/* Contenedor principal para centrar el contenido (igual que Home/Lineal) */
.main-container {
  min-height: 100vh;
  background: linear-gradient(to right, #1a1a1a, #0d0d0d);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

/* El content-wrapper es más amplio aquí para contener el menú y el contenido */
.content-wrapper {
  width: 100%;
  max-width: 90rem; /* Más amplio para el layout */
  background-color: #2e2e2e; 
  border-radius: 1.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
  padding: 2.5rem;
  color: white;
  text-align: center;
}

.title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 2rem;
  color: #4caf50;
  text-transform: uppercase;
}

/* Estilos del menú de navegación superior */
.nav-container {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #388e3c; /* Línea separadora */
}

.nav-button {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  color: #1a1a1a;
  background-color: #4caf50;
  text-decoration: none;
  transition: background-color 0.2s, transform 0.2s;
  flex-shrink: 0;
}

.nav-button:hover {
  background-color: #66bb6a;
  transform: translateY(-2px);
}

.nav-disabled {
  background-color: #555;
  color: #ccc;
  cursor: not-allowed;
}

.router-link-active {
  background-color: #388e3c; /* Color cuando la ruta está activa */
  color: white;
  pointer-events: none; /* Deshabilita el click en el botón activo */
}

/* Contenedor donde se monta el componente de la simulación */
.simulacion-content {
    padding-top: 2rem;
}
</style>
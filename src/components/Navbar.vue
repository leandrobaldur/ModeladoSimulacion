<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <nav class="navbar">
    <ul>
      <li><RouterLink to="/">Inicio</RouterLink></li>
      <li><RouterLink to="/lineal">Lineal</RouterLink></li>
      <li><RouterLink to="/multiplicativo">Multiplicativo</RouterLink></li>
      <li><RouterLink to="/simulaciones">Simulaciones</RouterLink></li>
    </ul>
  </nav>
</template>

<style scoped>
.navbar {
  position: fixed; /* 🔥 Fijo arriba */
  top: 0;
  left: 0;
  width: 100%;
  background-color: #333;
  padding: 12px 24px;
  z-index: 1000; /* Se asegura que quede sobre el contenido */
}

.navbar ul {
  list-style: none;
  display: flex;
  gap: 2rem;
  margin: 0;
  padding: 0;
}

.navbar a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition:
    color 0.2s ease,
    border-bottom 0.2s ease;
}

.navbar a:hover {
  color: #00bfff;
  border-bottom: 2px solid #00bfff;
}

.navbar a.router-link-exact-active {
  font-weight: bold;
  border-bottom: 2px solid white;
}

/* 🔽 Para que el contenido no quede oculto detrás del navbar fijo */
body {
  margin: 0;
  padding-top: 60px; /* Ajusta este valor según la altura del navbar */
}
</style>

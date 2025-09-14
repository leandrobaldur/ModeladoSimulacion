<script setup lang="ts">
import Navbar from './components/Navbar.vue'
</script>

<template>
  <div>
    <Navbar />
    <main style="padding: 1rem">
      <router-view />
    </main>
  </div>
  
</template>

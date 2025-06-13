<template>
  <div :style="{background: '#fdffe6', margin: 0, padding: 0, height: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column'}">
    <Navbar />
    <router-view />
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue'
</script>

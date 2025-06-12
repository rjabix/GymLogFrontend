<template>
  <div class="container">
    <h2 class="title">Twoje treningi</h2>
    <div v-for="training in trainings" :key="training.id" class="training-item">
      {{ training.date }} – {{ training.duration }} min
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const trainings = ref([])

onMounted(() => {
  trainings.value = [
    {id: 1, date: '2025-06-01', duration: 60},
    {id: 2, date: '2025-06-03', duration: 75}
  ]
})
</script>

<style scoped>
.container {
  padding: 1.5rem;
}

.title {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.training-item {
  border-bottom: 1px solid #ddd;
  padding: 0.5rem 0;
}
</style>

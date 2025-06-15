<template>
  <div class="ranking-page">
    <div class="exercise-list">
      <button
        v-for="exercise in exercises"
        :key="exercise.id"
        :class="['exercise-button', { active: selectedExercise?.id === exercise.id }]"
        @click="selectExercise(exercise)"
      >
        {{ exercise.name }}
      </button>
    </div>

    <div class="ranking-chart">
      <div class="chart-placeholder">
        <p v-if="selectedExercise">Dane dla: <strong>{{ selectedExercise.name }}</strong></p>
        <p v-else>Wybierz ćwiczenie z listy po lewej</p>
        <!-- Tutaj dodasz wykres w przyszłości -->
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useExercisesStore } from '@/store/exercises.js';

export default {
  name: 'ExerciseRanking',
  setup() {
    const exercisesStore = useExercisesStore();
    const selectedExercise = ref(null);

    const selectExercise = (exercise) => {
      selectedExercise.value = exercise;
    };

    const filteredExercises = computed(() =>
      exercisesStore.exercises.filter((exercise) => exercise.isCountedForRanking)
    );

    onMounted(async () => {
      await exercisesStore.fetchExercises();
    });

    return {
      exercises: filteredExercises,
      selectedExercise,
      selectExercise,
    };
  },
};
</script>


<style scoped>
.ranking-page {
  display: flex;
  height: 70vh; /* Full height of the viewport */
  padding: 50px;
  background-color: #fdffe6;
  gap: 20px;
}

.exercise-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: auto;
  margin-bottom: auto;
  min-width: 300px; /* Increased size */
  flex-basis: 300px; /* Ensures it takes up more space */
}

.exercise-button {
  padding: 10px 15px;
  border: 2px solid #d36c6c;
  border-radius: 9999px;
  background-color: transparent;
  color: #a94442;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s ease;
  text-align: left;
}

.exercise-button:hover {
  background-color: #f5b6b6;
}

.exercise-button.active {
  background-color: #e57373;
  color: white;
}

.ranking-chart {
  flex-grow: 1; /* Takes up the remaining space */
  height: 100%; /* Ensures it stretches to the full height of the parent */
  box-sizing: border-box; /* Includes padding in the height calculation */
  background-color: #fbe9e7;
  border: 4px solid #ef9a9a;
  border-radius: 20px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-placeholder {
  text-align: center;
  color: #5d4037;
  font-size: 1.2em;
}
</style>

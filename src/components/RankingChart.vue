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
      <div v-if="selectedExercise" class="chart-container">
        <canvas id="rankingChart"></canvas>
      </div>
      <div v-else class="chart-placeholder">
        <p>Wybierz ćwiczenie z listy po lewej</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { onBeforeRouteUpdate} from "vue-router";
import { useExercisesStore } from '@/store/exercises.js';
import { useRankingsStore } from '@/store/rankings.js';
import { Chart } from 'chart.js';

import {
  CategoryScale,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from "axios";
import backend_url from "@/router/backend_url.js";

// Register the required components
Chart.register(
  CategoryScale,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default {
  name: 'ExerciseRanking',
  setup() {
    const exercisesStore = useExercisesStore();
    const rankingsStore = useRankingsStore();
    const selectedExercise = ref(null);
    const chartInstance = ref(null);
    const exercises = ref([]);

    const selectExercise = async (exercise) => {
      selectedExercise.value = exercise;

      // Fetch ranking data for the selected exercise
      const rankingData = await rankingsStore.fetchRanking(exercise.id);
      const avgData = await axios.get(backend_url + '/rankings/progress/avg-orm-per-exercise?exercise_id='+exercise.id, {
        withCredentials: true
      });
      const processedData = {
        labels: avgData.data.labels,
        data: avgData.data.values,
      };
      // Update the chart with the new data
      updateChart(rankingData.labels, rankingData.data, processedData.data);
    };

    const updateChart = (labels, data, avgData) => {
      if (chartInstance.value) {
        chartInstance.value.destroy(); // Destroy the previous chart instance
      }

      const ctx = document.getElementById('rankingChart').getContext('2d');
      chartInstance.value = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Your One Rep Max Progression',
              data: data,
              borderColor: '#42a5f5',
              backgroundColor: 'rgba(66, 165, 245, 0.2)',
              borderWidth: 2,
              tension: 0.3,
            },
            {
              label: 'Average One Rep Max Progression',
              data: avgData,
              borderColor: 'rgba(222,14,39,0.86)',
              backgroundColor: 'rgba(222,14,39,0.86)',
              borderWidth: 2,
              tension: 0.3,
            }
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top',
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Week',
              },
            },
            y: {
              title: {
                display: true,
                text: 'One Rep Max',
              },
              beginAtZero: true,
            },
          },
        },
      });
    };

    const initializeComponent = async () => {
      await exercisesStore.fetchExercises();
      exercises.value = exercisesStore.exercises.filter((exercise) => exercise.isCountedForRanking);

      if (exercises.value.length > 0) {
        await selectExercise(exercises.value[0]);
      }
    };

    onMounted(async () => {
      await initializeComponent();
    });

    onBeforeRouteUpdate(async (to, from, next) => {
      // Reinitialize the component when the route changes
      await initializeComponent();
      next();
    });

    return {
      exercises,
      selectedExercise,
      selectExercise,
    };
  },
};
</script>

<style scoped>
.ranking-page {
  display: flex;
  height: 70vh;
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
  min-width: 300px;
  flex-basis: 300px;
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
  flex-grow: 1;
  height: 100%;
  box-sizing: border-box;
  background-color: #fbe9e7;
  border: 4px solid #ef9a9a;
  border-radius: 20px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-container {
  width: 100%;
  height: 100%;
}

.chart-placeholder {
  text-align: center;
  color: #5d4037;
  font-size: 1.2em;
}
</style>

<template>
  <div class="training-cards-container">
    <h2 class="trainings-title">Moje Treningi</h2>

    <div v-if="trainings.length > 0" class="training-cards-grid">
      <div v-for="training in trainings" :key="training.id" class="training-card">
        <div class="training-date-header">
          {{ formatDisplayDate(training.start_time) }}
        </div>

        <div class="training-content">
          <div class="time-circles">
            <div class="circle-time">{{ formatTime(training.start_time) }}</div>
            <div class="circle-time">{{ formatTime(training.end_time) }}</div>
          </div>

          <div class="training-details">
            <div class="training-exercises">
              <div
                class="exercise-pill"
                v-for="(exercise, index) in training.exercises.slice(0, 3)"
                :key="index"
              >
                {{ exercise.name }}
              </div>
            </div>

            <div class="card-buttons">
              <button class="card-button" @click="redirectToDetails(training.id)">Pokaż wszystko</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="no-trainings-message">
      Brak dostępnych treningów.
    </div>
  </div>
</template>



<script>
import { useTrainingsStore } from "@/store/trainings.js";
import { useExercisesStore } from "@/store/exercises.js";
import { useRouter } from "vue-router";
import { onMounted, computed } from "vue";

export default {
  name: "TrainingList",
  setup() {
    const trainingsStore = useTrainingsStore();
    const exercisesStore = useExercisesStore();
    const router = useRouter();

    const trainings = computed(() => {
      // Map exercise names dynamically using the exercises store
      const exerciseNameMap = new Map(exercisesStore.exercises.map(ex => [ex.id, ex.name]));
      return trainingsStore.trainings.map(training => ({
        ...training,
        exercises: training.exercises.map(exercise => ({
          ...exercise,
          name: exerciseNameMap.get(exercise.exerciseId) || "Unknown Exercise",
        })),
      }));
    });

    const formatDisplayDate = (date) => {
      const options = { day: "numeric", month: "long", year: "numeric" };
      return new Date(date).toLocaleDateString("pl-PL", options);
    };

    const formatTime = (date) => {
      return new Date(date).toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" });
    };

    const redirectToDetails = (trainingId) => {
      router.push(`/training/${trainingId}`);
    };

    onMounted(async () => {
      await exercisesStore.fetchExercises();
      await trainingsStore.fetchTrainings();
    });

    return {
      trainings,
      formatDisplayDate,
      formatTime,
      redirectToDetails,
    };
  },
};
</script>

<style scoped>
.training-cards-container {
  width: 95%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  font-family: sans-serif;
}

.trainings-title {
  text-align: center;
  font-size: 2em;
  margin-bottom: 20px;
  color: #c62828;
}

.training-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
}

.training-card {
  background: none;
  border-radius: 15px;
  border: 5px solid #f36e7a;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  color: #4e342e;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.training-date-header {
  background-color: #ef9a9a;
  color: white;
  border-radius: 9999px;
  padding: 5px 12px;
  font-size: 0.95em;
  font-weight: bold;
  align-self: flex-start;
}

.training-content {
  display: flex;
  gap: 20px;
  align-items: center;
}

.time-circles {
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
}

.circle-time {
  background-color: #fbe9e7;
  color: #d84315;
  border: 3px solid #ef5350;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4em;
  font-weight: bold;
}

.training-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.training-exercises {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: flex-start;
}

.exercise-pill {
  background-color: #e57373;
  color: white;
  padding: 6px 12px;
  border-radius: 9999px;
  font-size: 0.85em;
  white-space: nowrap;
}

.card-buttons {
  display: flex;
  justify-content: flex-start;
}

.card-button {
  background-color: #f06292;
  color: white;
  border: none;
  border-radius: 9999px;
  padding: 8px 16px;
  font-size: 0.85em;
  cursor: pointer;
  transition: background-color 0.3s;
}

.card-button:hover {
  background-color: #ec407a;
}

.no-trainings-message {
  text-align: center;
  font-size: 1.2em;
  color: #555;
  margin-top: 20px;
}

@media (max-width: 850px) {
  .training-cards-grid {
    grid-template-columns: 1fr;
  }
}

</style>

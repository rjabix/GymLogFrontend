<template>
  <div class="training-details-container">
    <div v-if="training" class="details-card">
      <div>
        <div class="exercise-section">
          <div
            v-for="(exercise, index) in training.exercises"
            :key="exercise.id"
            class="exercise-card"
          >
            <div class="exercise-header" @click="toggle(index)">
              {{ getExerciseName(exercise.exerciseId) }}
              <span>{{ expanded.includes(index) ? "▲" : "▼" }}</span>
            </div>

            <div v-if="expanded.includes(index)" class="exercise-details">
              <div class="detail-pill">Waga: {{ exercise.weight }}kg</div>
              <div class="detail-pill">Serii: {{ exercise.sets }}</div>
              <div class="detail-pill">Powtórzenia: {{ exercise.reps }}</div>
              <div class="detail-pill">
                Zweryfikowano:
                {{ exercise.isVerified ? 'tak' : 'nie' }}
              </div>
            </div>
          </div>
          <div v-if="showAddForm" class="add-form">
            <select v-model="newExercise.exerciseId">
              <option disabled value="">Wybierz ćwiczenie</option>
              <option
                v-for="exercise in exercisesStore.exercises"
                :key="exercise.id"
                :value="exercise.id"
              >
                {{ exercise.name }}
              </option>
            </select>

            <input v-model.number="newExercise.weight" type="number" placeholder="Waga (kg)" />
            <input v-model.number="newExercise.sets" type="number" placeholder="Serie" />
            <input v-model.number="newExercise.reps" type="number" placeholder="Powtórzenia" />

            <button class="btn" @click="submitExercise">Zapisz</button>
          </div>
        </div>



        <div class="buttons">
          <button class="btn" @click="goBack">powrót</button>
          <button class="btn" @click="showAddForm = !showAddForm">
            {{ showAddForm ? "anuluj" : "dodaj ćwiczenie" }}
          </button>
        </div>
      </div>

      <div class="time-section">
        <div class="date-pill">{{ formatDisplayDate(training.start_time) }}</div>
        <div :style="{display: 'flex', gap: '20px', alignItems: 'center'}">
          <div class="circle-time">{{ formatTime(training.start_time) }}</div>
          <div class="circle-time">{{ formatTime(training.end_time) }}</div>
        </div>
        <div class="date-pill">{{ calculateSpentTime(training.start_time, training.end_time) }}</div>
      </div>
    </div>

    <div v-else>
      <p class="no-training">Trening nie został znaleziony.</p>
    </div>
  </div>
</template>

<script>
import { useRoute, useRouter } from "vue-router";
import { useTrainingsStore } from "@/store/trainings";
import { useExercisesStore } from "@/store/exercises";
import { onMounted, computed, ref } from "vue";
import {useAuthStore} from "@/store/auth.js";

export default {
  name: "TrainingDetails",
  setup() {
    const route = useRoute();
    const router = useRouter();
    const trainingId = parseInt(route.params.id);

    const trainingsStore = useTrainingsStore();
    const exercisesStore = useExercisesStore();
    const authStore = useAuthStore();

    const expanded = ref([]);

    const training = computed(() => {
      return trainingsStore.trainings.find((t) => t.id === trainingId);
    });

    const getExerciseName = (id) => {
      const ex = exercisesStore.exercises.find((e) => e.id === id);
      return ex ? ex.name : "Nieznane ćwiczenie";
    };

    const formatDisplayDate = (date) => {
      return new Date(date).toLocaleDateString("pl-PL", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    };

    const formatTime = (date) => {
      return new Date(date).toLocaleTimeString("pl-PL", {
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    const toggle = (index) => {
      if (expanded.value.includes(index)) {
        expanded.value = expanded.value.filter((i) => i !== index);
      } else {
        expanded.value.push(index);
      }
    };

    const goBack = () => {
      router.back();
    };

    const calculateSpentTime = (startTime, endTime) => {
      const start = new Date(startTime);
      const end = new Date(endTime);
      const diffMs = end - start; // Difference in milliseconds
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      return `${diffHrs} godz. ${diffMins} min.`;
    };

    onMounted(async () => {
      await exercisesStore.fetchExercises();
      await trainingsStore.fetchTrainings();
    });

    const showAddForm = ref(false);
    const newExercise = ref({
      exerciseId: "",
      weight: null,
      sets: null,
      reps: null,
    });

    const submitExercise = () => {
      if (
        !newExercise.value.exerciseId ||
        newExercise.value.weight <= 0 ||
        newExercise.value.sets <= 0 ||
        newExercise.value.reps <= 0
      ) {
        alert("Please fill in all fields correctly.");
        return;
      }

      if (training.value) {
        exercisesStore.addExercise({
          trainingId: trainingId,
          exerciseId: newExercise.value.exerciseId,
          userId: authStore.user.id,
          sets: newExercise.value.sets,
          reps: newExercise.value.reps,
          weight: newExercise.value.weight,
        });

        // Reset and hide the form
        newExercise.value = {
          exerciseId: "",
          weight: null,
          sets: null,
          reps: null,
        };
        showAddForm.value = false;
      }
    };

    return {
      training,
      formatDisplayDate,
      formatTime,
      getExerciseName,
      expanded,
      toggle,
      goBack,
      calculateSpentTime,
      submitExercise,
      showAddForm,
      newExercise,
      exercisesStore,
    };
  },
};
</script>

<style scoped>
.training-details-container {
  padding: 20px;
  width: 80%;
  margin: auto;
  font-family: sans-serif;
}

.details-card {
  background-color: #f8a8a8;
  border-radius: 20px;
  padding: 20px;
  display: flex;
  gap: 20px;
  justify-content: space-around;
}

.time-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: auto;
  margin-bottom: auto;
  gap: 12px;
}

.date-pill {
  background-color: #ef5350;
  color: white;
  padding: 6px 14px;
  border-radius: 9999px;
  font-weight: bold;
  font-size: 0.95em;
}

.circle-time {
  background-color: #fbe9e7;
  color: #d84315;
  border: 3px solid #ef5350;
  border-radius: 50%;
  width: 90px;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6em;
  font-weight: bold;
}

.exercise-section {
  flex: 2 1 400px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.exercise-card {
  background-color: #e57373;
  border-radius: 14px;
  padding: 10px;
  color: white;
}

.exercise-header {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  cursor: pointer;
}

.exercise-details {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.detail-pill {
  background-color: #f8bfbf;
  border-radius: 8px;
  padding: 5px 10px;
  font-size: 0.9em;
  color: #5d4037;
}

.buttons {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  gap: 20px;
  margin-top: 20px;
}

.btn {
  background-color: #ef5350;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 12px;
  font-size: 1em;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: #e53935;
}

.no-training {
  text-align: center;
  font-size: 1.3em;
  padding: 40px;
  color: #555;
}

.add-form {
  background-color: #e57373;
  border-radius: 14px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  color: white;
}

.add-form select,
.add-form input {
  background-color: #fbe9e7;
  border: 2px solid #ef5350;
  border-radius: 8px;
  padding: 10px;
  font-size: 1em;
  color: #5d4037;
  outline: none;
  transition: border-color 0.3s ease;
}

.add-form select:focus,
.add-form input:focus {
  border-color: #d84315;
}

.add-form .btn {
  align-self: flex-start;
  background-color: #ef5350;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 12px;
  font-size: 1em;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.add-form .btn:hover {
  background-color: #e53935;
}
</style>

<template>
  <div class="add-training-container">
    <h1>Dodaj Trening</h1>

    <div class="form-section">
      <label for="start-time">Czas rozpoczęcia:</label>
      <input v-model="startTime" type="datetime-local" id="start-time" />

      <label for="end-time">Czas zakończenia:</label>
      <input v-model="endTime" type="datetime-local" id="end-time" />
    </div>

    <div class="exercise-section">
      <h2>Dodaj Ćwiczenia</h2>
      <div v-for="(exercise, index) in exercises" :key="index" class="exercise-card">
        <div>{{ getExerciseName(exercise.exerciseId) }}</div>
        <div>Waga: {{ exercise.weight }}kg</div>
        <div>Serie: {{ exercise.sets }}</div>
        <div>Powtórzenia: {{ exercise.reps }}</div>
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

        <button class="btn" @click="addExercise">Dodaj Ćwiczenie</button>
      </div>

      <button class="btn" @click="showAddForm = !showAddForm" :style="{ marginTop: '10px' }">
        {{ showAddForm ? "Anuluj" : "Dodaj Ćwiczenie" }}
      </button>
    </div>

    <div class="buttons">
      <button class="btn" @click="submitTraining">Zapisz Trening</button>
      <button class="btn" @click="goBack">Powrót</button>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useTrainingsStore } from "@/store/trainings";
import { useExercisesStore } from "@/store/exercises";

export default {
  name: "AddTraining",
  setup() {
    const router = useRouter();
    const trainingsStore = useTrainingsStore();
    const exercisesStore = useExercisesStore();

    const startTime = ref(new Date().toISOString().slice(0, 16));
    const endTime = ref(new Date(new Date().getTime() + 3600000).toISOString().slice(0, 16)); // Default to 1 hour later
    const exercises = ref([]);
    const showAddForm = ref(false);
    const newExercise = ref({
      exerciseId: "",
      weight: null,
      sets: null,
      reps: null,
    });

    const getExerciseName = (id) => {
      const ex = exercisesStore.exercises.find((e) => e.id === id);
      return ex ? ex.name : "Nieznane ćwiczenie";
    };

    const addExercise = () => {
      if (
        !newExercise.value.exerciseId || // Ensure exerciseId is used consistently
        newExercise.value.weight < 0 ||
        newExercise.value.sets <= 0 ||
        newExercise.value.reps <= 0
      ) {
        alert("Uzupełnij poprawnie wszystkie pola.");
        return;
      }

      exercises.value.push({ ...newExercise.value }); // Only push exerciseId
      newExercise.value = {
        exerciseId: "", // Reset exerciseId
        weight: null,
        sets: null,
        reps: null,
      };
      showAddForm.value = false;
    };

    const submitTraining = () => {
      if (!startTime.value || !endTime.value || exercises.value.length === 0) {
        alert("Uzupełnij wszystkie pola.");
        return;
      }

      const adjustedStartTime = new Date(startTime.value);
      adjustedStartTime.setHours(adjustedStartTime.getHours() + 2);

      const adjustedEndTime = new Date(endTime.value);
      adjustedEndTime.setHours(adjustedEndTime.getHours() + 2);

      const newTraining = {
        startTime: adjustedStartTime.toISOString(),
        endTime: adjustedEndTime.toISOString(),
        exercises: exercises.value,
      };

      console.log(JSON.stringify(newTraining, null, 2));
      trainingsStore.addTraining(newTraining);

      router.push("/trainings");
    };

    const goBack = () => {
      router.back();
    };

    onMounted(async () => {
      await exercisesStore.fetchExercises();
    });

    return {
      startTime,
      endTime,
      exercises,
      showAddForm,
      newExercise,
      getExerciseName,
      addExercise,
      submitTraining,
      goBack,
      exercisesStore,
    };
  },
};
</script>

<style scoped>
.add-training-container {
  padding: 20px;
  width: 80%;
  margin: auto;
  font-family: sans-serif;
}

.form-section {
  margin-bottom: 20px;
}

.exercise-section {
  margin-bottom: 20px;
}

.exercise-card {
  background-color: #e57373;
  border-radius: 14px;
  padding: 10px;
  color: white;
  margin-bottom: 10px;
}

.buttons {
  display: flex;
  gap: 10px;
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

.btn {
  background-color: #ef5350;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
}
</style>

<template>
  <div class="tlo">
    <div class="training-container" data-aos="fade-up">
      <div class="user-selector-container">
        <label for="user-select" class="user-select-label">Wybierz użytkownika:</label>
        <select id="user-select" v-model="selectedUser" @change="displaySelectedUserTrainings"
                class="user-select">
          <option :value="null" disabled>-- Wybierz --</option>
          <option v-for="user in users" :key="user.id" :value="user">{{ user.name }}</option>
        </select>
        <button @click="submitAllEvaluations" class="submit-button" :disabled="!isSubmitEnabled">
          Wyślij oceny
        </button>
      </div>

      <template v-if="selectedUser">
        <div v-for="(dateKey) in sortedExerciseDates" :key="dateKey" class="training-day-group">
          <div class="user-info training-date-header" @click="toggleTrainingDayCollapse(dateKey)">
            <span>Trening z dnia: <strong>{{ formatDisplayDate(dateKey) }}</strong></span>
            <font-awesome-icon :icon="['fas', isCollapsed(dateKey) ? 'chevron-down' : 'chevron-up']"
                               class="header-icon"/>
          </div>

          <div class="training-list" v-show="!isCollapsed(dateKey)">
            <div v-for="(exercise, index) in selectedUser.exerciseLogs[dateKey]"
                 :key="exercise.id" class="training-item"
                 :class="{
                 'evaluated-accepted': exercise.evaluation === 'accepted',
                 'evaluated-denied': exercise.evaluation === 'denied'
               }">
            <span class="exercise-details">
              <strong>{{ exercise.name }}</strong> | {{ exercise.weight }}Kg | {{ exercise.sets }} serie | {{
                exercise.reps
              }} powtórzeń
            </span>
              <div class="icons">
                <font-awesome-icon :icon="['fas', 'circle-xmark']"
                                   class="exercise-action-icon deny-exercise-icon"
                                   @click.stop="setExerciseEvaluation(selectedUser.id, dateKey, index, 'denied')"
                                   :class="{ 'is-active': exercise.evaluation === 'denied' }"/>
                <font-awesome-icon :icon="['fas', 'circle-check']"
                                   class="exercise-action-icon accept-exercise-icon"
                                   @click.stop="setExerciseEvaluation(selectedUser.id, dateKey, index, 'accepted')"
                                   :class="{ 'is-active': exercise.evaluation === 'accepted' }"/>
              </div>
            </div>
          </div>
        </div>
      </template>
      <div v-else class="no-user-selected">
        Proszę wybrać użytkownika z listy.
      </div>
    </div>
  </div>
</template>

<script>
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
import {library} from '@fortawesome/fontawesome-svg-core';
import {
  faChevronDown,
  faChevronUp,
  faCircleXmark,
  faCircleCheck
} from '@fortawesome/free-solid-svg-icons';
import {generateMockupExercises} from "@/models/exercise.js";
import {generateMockupPerformedExercises} from "@/models/performed_exercise.js";

// Importuj klasy i funkcje do generowania mockowych danych

library.add(faChevronDown, faChevronUp, faCircleXmark, faCircleCheck);

export default {
  name: 'TrainingDashboard',
  components: {FontAwesomeIcon},
  data() {
    return {
      selectedUser: null,
      collapsedTrainingDays: {},
      users: [], // users będzie teraz budowane dynamicznie
      mockPerformedExercises: [],
      mockExercises: []
    };
  },
  created() {
    //TODO Zmienic mockupy na prawdziwe dane z API!
    this.mockPerformedExercises = generateMockupPerformedExercises();
    this.mockExercises = generateMockupExercises();
    // Przetwórz dane, aby zbudować strukturę `users`
    this.processRawData();
  },
  computed: {
    sortedExerciseDates() {
      if (!this.selectedUser || !this.selectedUser.exerciseLogs) {
        return [];
      }
      return Object.keys(this.selectedUser.exerciseLogs).sort((a, b) => new Date(b) - new Date(a));
    },
    isSubmitEnabled() {
      return this.users.some(user => {
        for (const dateKey in user.exerciseLogs) {
          if (user.exerciseLogs[dateKey].some(exercise => exercise.evaluation !== null)) {
            return true;
          }
        }
        return false;
      });
    }
  },
  methods: {
    formatDisplayDate(dateString) {
      const date = new Date(dateString);
      const options = {day: 'numeric', month: 'long', year: 'numeric'};
      return date.toLocaleDateString('pl-PL', options);
    },
    displaySelectedUserTrainings() {
      console.log(`Wybrano użytkownika: ${this.selectedUser.name}`);
      this.initializeCollapsedStates();
    },
    setExerciseEvaluation(userId, dateKey, exerciseIndex, newEvaluation) {
      const user = this.users.find(u => u.id === userId);
      if (user && user.exerciseLogs[dateKey]) {
        const exercise = user.exerciseLogs[dateKey][exerciseIndex];

        if (exercise.evaluation === newEvaluation) {
          exercise.evaluation = null;
        } else {
          exercise.evaluation = newEvaluation;
        }

        console.log(`Użytkownik ${user.name}, data ${dateKey}, Wykonane Ćwiczenie ID: ${exercise.id}, Nazwa: "${exercise.name}" oceniono jako: ${exercise.evaluation || 'Nieocenione'}`);
      }
    },
    toggleTrainingDayCollapse(dateKey) {
      this.collapsedTrainingDays[dateKey] = !this.collapsedTrainingDays[dateKey];
    },
    isCollapsed(dateKey) {
      return !!this.collapsedTrainingDays[dateKey];
    },
    initializeCollapsedStates() {
      if (this.selectedUser) {
        const dates = Object.keys(this.selectedUser.exerciseLogs);
        dates.forEach(dateKey => {
          if (this.collapsedTrainingDays[dateKey] === undefined) {
            this.collapsedTrainingDays[dateKey] = false;
          }
        });
      }
    },
    submitAllEvaluations() {
      const acceptedExerciseIds = [];
      const deniedExerciseIds = [];

      this.users.forEach(user => {
        for (const dateKey in user.exerciseLogs) {
          user.exerciseLogs[dateKey].forEach(exercise => {
            // exercise.id to teraz id ZWYKŁEGO WYKONANEGO ĆWICZENIA (PerformedExercise.id)
            if (exercise.evaluation === 'accepted' && exercise.id) {
              acceptedExerciseIds.push(exercise.id);
            } else if (exercise.evaluation === 'denied' && exercise.id) {
              deniedExerciseIds.push(exercise.id);
            }
          });
        }
      });

      const submissionPayload = {
        accepted: acceptedExerciseIds,
        denied: deniedExerciseIds
      };

      if (acceptedExerciseIds.length > 0 || deniedExerciseIds.length > 0) {
        console.log("--- Wysyłanie ocen treningów ---");
        console.log(JSON.stringify(submissionPayload, null, 2));
        console.log("--- Wysyłka zakończona (symulacja) ---");
        alert(`Wysłano ${acceptedExerciseIds.length} zaakceptowanych i ${deniedExerciseIds.length} odrzuconych ćwiczeń! Sprawdź konsolę.`);

        // Możesz dodać resetowanie ocen po wysłaniu
        // this.resetAllEvaluations();
      } else {
        alert("Brak ocenionych ćwiczeń do wysłania.");
        console.log("Brak ocenionych ćwiczeń do wysłania.");
      }
    },
    resetAllEvaluations() {
      this.users.forEach(user => {
        for (const dateKey in user.exerciseLogs) {
          user.exerciseLogs[dateKey].forEach(exercise => {
            exercise.evaluation = null;
          });
        }
      });
      console.log("Wszystkie oceny zostały zresetowane.");
    },

    // Nowa metoda do przetwarzania surowych danych z API mock
    processRawData() {
      const usersMap = new Map();
      const exerciseTemplatesMap = new Map(this.mockExercises.map(ex => [ex.id, ex.name]));

      this.mockPerformedExercises.forEach(pExercise => {
        // Upewnij się, że użytkownik istnieje w mapie
        if (!usersMap.has(pExercise.userId)) {
          usersMap.set(pExercise.userId, {
            id: pExercise.userId,
            name: pExercise.userName,
            exerciseLogs: {} // Obiekt do przechowywania treningów wg daty
          });
        }

        const currentUser = usersMap.get(pExercise.userId);
        const dateKey = pExercise.date; // Data jest już w formacie YYYY-MM-DD

        // Upewnij się, że istnieje wpis dla danej daty
        if (!currentUser.exerciseLogs[dateKey]) {
          currentUser.exerciseLogs[dateKey] = [];
        }

        // Pobierz nazwę ćwiczenia z szablonów
        const exerciseName = exerciseTemplatesMap.get(pExercise.exerciseId) || 'Nieznane ćwiczenie';

        // Dodaj wykonane ćwiczenie do listy
        currentUser.exerciseLogs[dateKey].push({
          id: pExercise.id, // ID wykonanego ćwiczenia
          name: exerciseName, // Nazwa z szablonu
          weight: pExercise.weight,
          sets: pExercise.sets,
          reps: pExercise.reps,
          // 'evaluation' to nasze własne pole, które nie pochodzi z API
          evaluation: pExercise.isVerified === true ? 'accepted' : (pExercise.isVerified === false ? 'denied' : null)
        });
      });

      // Konwertuj Map na tablicę i posortuj użytkowników (opcjonalnie)
      this.users = Array.from(usersMap.values()).sort((a, b) => a.name.localeCompare(b.name));

      // Jeśli chcesz od razu wybrać pierwszego użytkownika po załadowaniu
      if (this.users.length > 0) {
        this.selectedUser = this.users[0];
      }
    }
  },
  mounted() {
    // Inicjalizacja stanów zwijania dla pierwszego wybranego użytkownika (jeśli jest)
    this.initializeCollapsedStates();
  }
};
</script>

<style scoped>
/* (Style section remains unchanged from the last version) */

/* Globalne tło (dla całej strony, jeśli ten komponent jest główny) */
.tlo {
  font-family: sans-serif;
  background-color: #fdffe6; /* Jasny beżowy/kremowy kolor tła */
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: flex-start; /* Dopasowanie do góry, bo pomijamy navbara */
  min-height: 100vh;
}

.training-container {
  width: 90%;
  max-width: 800px;
  margin-top: 25px; /* Odstęp od góry, symulujący brak navbara */
  margin-left: auto;
  margin-right: auto;
  padding: 20px;
  box-sizing: border-box;
  background-color: #f8f0ed; /* Tło takie jak body */
  border-radius: 10px; /* Delikatne zaokrąglenie całego kontenera */
}

.user-selector-container {
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  gap: 15px; /* Zwiększony odstęp dla przycisku */
  flex-wrap: wrap; /* Pozwala elementom zawijać się na mniejszych ekranach */
}

.user-select-label {
  font-weight: bold;
  color: #333;
  font-size: 1.1em;
}

.user-select {
  padding: 10px 15px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background-color: #fff;
  font-size: 1em;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  min-width: 180px;
  flex-grow: 1; /* Pozwala mu rosnąć, ale ograniczony przez max-width kontenera */
  max-width: 250px; /* Ograniczenie szerokości na większych ekranach */
}

.user-select:focus {
  outline: none;
  border-color: #f4cccc;
  box-shadow: 0 0 0 3px rgba(244, 204, 204, 0.5);
}

.submit-button {
  padding: 10px 20px;
  background-color: #4CAF50; /* Zielony kolor */
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1em;
  font-weight: bold;
  transition: background-color 0.3s ease, transform 0.1s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  white-space: nowrap; /* Zapobiega łamaniu tekstu na małych ekranach */
}

.submit-button:hover {
  background-color: #45a049;
  transform: translateY(-1px);
}

.submit-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}


/* Date headers */
.training-date-header {
  margin-top: 30px;
  margin-bottom: 15px;
  background-color: #e78989;
  color: #222;
  padding: 15px 20px;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.1em;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  user-select: none;
}


.header-icon {
  font-size: 1.6em;
  transition: color 0.2s ease, transform 0.2s ease;
  color: #666;
}

.training-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  transition: all 0.3s ease-out;
  overflow: hidden;
}

.training-item {
  background-color: #f4cccc;
  color: #333;
  padding: 15px 20px;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1em;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 2px solid transparent;
  transition: border-color 0.3s ease, background-color 0.3s ease;
}

.training-item.evaluated-accepted {
  border-color: #28a745;
  background-color: #e6ffe6;
}

.training-item.evaluated-denied {
  border-color: #dc3545;
  background-color: #ffe6e6;
}


.exercise-details strong {
  font-weight: bold;
}

.icons {
  display: flex;
  gap: 15px;
}

.exercise-action-icon {
  font-size: 1.5em;
  cursor: pointer;
  transition: color 0.2s ease, transform 0.2s ease;
  color: #b0c4de;
}

.exercise-action-icon:hover {
  transform: scale(1.1);
}

.exercise-action-icon.is-active {
  transform: scale(1.1);
  filter: brightness(1.2);
  font-weight: bold;
}

.deny-exercise-icon.is-active {
  color: #dc3545;
}

.accept-exercise-icon.is-active {
  color: #28a745;
}

.deny-exercise-icon:not(.is-active):hover {
  color: #c03030;
}

.accept-exercise-icon:not(.is-active):hover {
  color: #30a050;
}


.no-user-selected {
  text-align: center;
  padding: 30px;
  background-color: #ffe0b3;
  border-radius: 10px;
  color: #6a4f2b;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Media queries for responsiveness */
@media (max-width: 768px) {
  .training-container {
    margin-top: 20px;
    padding: 15px;
  }

  .user-info, .training-item, .training-date-header {
    font-size: 0.9em;
    padding: 12px 15px;
  }

  .exercise-action-icon, .header-icon {
    font-size: 1.2em;
  }

  .user-selector-container {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .submit-button {
    width: 100%;
    margin-top: 5px;
  }
}
</style>

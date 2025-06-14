// `src/store/exercises.js`
import { defineStore } from 'pinia';
import { generateMockupExercises } from '@/models/exercise.js';

export const useExercisesStore = defineStore('exercises', {
  state: () => ({
    exercises: [],
  }),
  actions: {
    async fetchExercises() {
      if (this.exercises.length > 0) {
        // If exercises are already loaded, do not fetch again
        return;
      }
      try {
        console.log('Fetching exercises...');
        // TODO: Replace with API call when ready: const res = await axios.get('/api/exercises');
        const res = { data: generateMockupExercises() }; // Mockup data for now
        this.exercises = res.data;
      } catch (err) {
        console.error('Error fetching exercises:', err.message);
      }
    }
  },
});

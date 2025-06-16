import { defineStore } from 'pinia';
import axios from 'axios';
import backend_url from '@/router/backend_url';
import {useExercisesStore} from "@/store/exercises.js";

export const useRankingsStore = defineStore('rankings', {
  state: () => ({
    rankings: {},
    gym_time: []// Stores rankings by exercise_id
  }),
  actions: {
    async fetchRanking(exercise_id) {
      // Check if the ranking for this exercise_id is already cached
      if (this.rankings[exercise_id]) {
        console.log(`Using cached ranking for exercise_id: ${exercise_id}`);
        return this.rankings[exercise_id];
      }

      try {
        console.log(`Fetching ranking for exercise_id: ${exercise_id}...`);
        const res = await axios.get(`${backend_url}/rankings/progress/${exercise_id}`, { withCredentials: true });
        console.log(`Fetched ranking for exercise_id ${exercise_id}:`, res.data);

        // Process and cache the fetched ranking
        const processedData = {
          labels: res.data.labels,
          data: res.data.values,
        };
        this.rankings[exercise_id] = processedData;
        return processedData;
      } catch (err) {
        console.error(`Error fetching ranking for exercise_id ${exercise_id}:`, err.message);
        throw err;
      }
    },
    clearRankings() {
      this.rankings = {};
      console.log('Cleared all cached rankings.');
    },

    async fetchGymTime() {
      // Check if the gym time data is already cached
      if (this.gym_time.length > 0) {
        console.log('Using cached gym time data...');
        return this.gym_time;
      }

      try {
        const res = await axios.get(`${backend_url}/rankings/time-per-day`, { withCredentials: true });

        // Process and cache the fetched data
        const processedData = res.data.map(entry => ({
          date: entry.date,
          value: entry.value,
        }));
        this.gym_time = processedData;
        return processedData;
      } catch (err) {
        console.error('Error fetching gym time data:', err.message);
        throw err;
      }
    },

    async fetchRankingForAllExercises() {
      try {
        const exercisesStore = useExercisesStore(); // Import and use the exercises store
        const exercises = exercisesStore.exercises.filter(ex => ex.isCountedForRanking); // Get all exercises from the store

        const rankings = await Promise.all(
          exercises.map(async (exercise) => {
            const ranking = await this.fetchRanking(exercise.id); // Fetch ranking for each exercise
            return { exerciseId: exercise.id, ranking };
          })
        );

        console.log('Fetched rankings for all exercises:', rankings);
        return rankings;
      } catch (err) {
        console.error('Error fetching rankings for all exercises:', err.message);
        throw err;
      }
    }
  },
});

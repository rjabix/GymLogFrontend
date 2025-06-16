import { defineStore } from 'pinia';
import axios from 'axios';
import backend_url from '@/router/backend_url';

export const useRankingsStore = defineStore('rankings', {
  state: () => ({
    rankings: {}, // Stores rankings by exercise_id
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
  },
});

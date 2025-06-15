// `src/store/exercises.js`
import { defineStore } from 'pinia';
import { generateMockupExercises } from '@/models/exercise.js';
import {useTrainingsStore} from "@/store/trainings.js";
import axios from 'axios';
import backend_url from '@/router/backend_url';

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
        const res = await axios.get(backend_url + '/exercises', {withCredentials: true});
        //const res = { data: generateMockupExercises() }; // Mockup data for now
        console.log('Fetched exercises:', JSON.stringify(res.data, null, 2));
        this.exercises = res.data;
      } catch (err) {
        console.error('Error fetching exercises:', err.message);
      }
    },
    
    addExercise(exercise) {

      const trainingsStore = useTrainingsStore();

      const newExercise = {
        trainingId: exercise.trainingId,
        exerciseId: exercise.exerciseId, // Use the passed exercise object
        userId: exercise.userId,
        sets: exercise.sets,
        reps: exercise.reps,
        weight: exercise.weight,
      };

      if (newExercise.sets < 0 || newExercise.sets > 20 ||
         newExercise.reps < 0 || newExercise.reps > 100 ||
         newExercise.weight < 0 || newExercise.weight > 500) {
        console.error('Invalid exercise data:', newExercise);
        alert('Invalid exercise data. Please check the values and try again.');
        return;
      }

      console.log('Adding performed exercise:', newExercise);
      // TODO: Implement API call to add exercise const res = await axios.post('/api/add-exercise', newExercise); -- will return the id of new exercise
      const res = { data: { id: Math.floor(Math.random() * 1000) } }; // Mockup response
      const id = res.data.id;
      console.log('Exercise added with ID:', id);

      // Add the exercise to the corresponding training in trainingsStore
      const training = trainingsStore.trainings.find(t => t.id === newExercise.trainingId);
      if (training) {
        training.exercises = [...(training.exercises || []), newExercise];
        trainingsStore.updateTraining(training);
        console.log('Updated training with new exercise:', training);
      } else {
        console.error('Training not found for ID:', newExercise.trainingId);
      }

    },
  },
});

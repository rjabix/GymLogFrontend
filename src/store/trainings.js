// `src/store/trainings.js`
import { defineStore } from 'pinia'
import axios from 'axios'
import {generateMockupPerformedExercises} from "@/models/performed_exercise.js";

export const useTrainingsStore = defineStore('trainings', {
  state: () => ({
    trainings: [],
    selectedTraining: null,
  }),
  actions: {
    async fetchTrainings() {


      try {
        // TODO: Uncomment when API is ready: const res = await axios.get('/api/trainings')
        const res = { data: generateMockupPerformedExercises() } // Mockup data for testing
        this.trainings = res.data
        this.saveToLocalStorage()
      } catch (err) {
        console.error('Error fetching trainings:', err.message)
      }
    },
    addTraining(training) {
      this.trainings.push(training)
      this.saveToLocalStorage()
    },
    updateTraining(updatedTraining) {
      const index = this.trainings.findIndex(t => t.id === updatedTraining.id)
      if (index !== -1) {
        this.trainings[index] = updatedTraining
        this.saveToLocalStorage()
      }
    },
    deleteTraining(trainingId) {
      this.trainings = this.trainings.filter(t => t.id !== trainingId)
      this.saveToLocalStorage()
    },
    saveToLocalStorage() {
      localStorage.setItem('trainingsStore', JSON.stringify(this.trainings))
    },
    loadFromLocalStorage() {
      const savedState = localStorage.getItem('trainingsStore')
      if (savedState) {
        this.trainings = JSON.parse(savedState)
      }
    },
  },
})

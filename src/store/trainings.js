// `src/store/trainings.js`
import { defineStore } from 'pinia'
import axios from 'axios'
import {generateMockupPerformedExercises} from "@/models/performed_exercise.js";
import {generateMockupTrainingsForOnePerson} from "@/models/training.js";

export const useTrainingsStore = defineStore('trainings', {
  state: () => ({
    trainings: [],
    selectedTraining: null,
  }),
  actions: {
    async fetchTrainings() {
      console.log('Fetching trainings...')
      if (this.trainings.length > 0) {
        // If trainings are already loaded, do not fetch again
        return
      }
      try {
        // TODO: Uncomment when API is ready: const res = await axios.get('/api/trainings')
        const res = { data: generateMockupTrainingsForOnePerson() } // Mockup data for testing
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
      sessionStorage.setItem('trainingsStore', JSON.stringify(this.trainings))
      console.log('Trainings state saved to localStorage')
    },
    loadFromLocalStorage() {
      const savedState = sessionStorage.getItem('trainingsStore')
      if (savedState) {
        this.trainings = JSON.parse(savedState)
      }
    },
  },
})

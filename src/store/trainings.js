// `src/store/trainings.js`
import { defineStore } from 'pinia'
import axios from 'axios'

export const useTrainingsStore = defineStore('trainings', {
  state: () => ({
    trainings: [],
    selectedTraining: null,
  }),
  actions: {
    async fetchTrainings() {
      function getMockupData() {
        return [
          {
            id: 1,
            name: 'Cardio Session',
            duration: 60,
            date: '2023-10-01',
            trainer: 'John Doe',
          },
          {
            id: 2,
            name: 'Strength Training',
            duration: 90,
            date: '2023-10-02',
            trainer: 'Jane Smith',
          },
        ]
      }

      try {
        // TODO: Uncomment when API is ready: const res = await axios.get('/api/trainings')
        const res = { data: getMockupData() } // Mockup data for testing
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

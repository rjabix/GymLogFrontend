// `src/store/trainings.js`
import { defineStore } from 'pinia'
import axios from 'axios'
import {generateMockupTrainingsForOnePerson} from "@/models/training.js";
import backend_url from "@/router/backend_url.js";
import {useRouter} from "vue-router";
import router from "@/router/index.js";

export const useTrainingsStore = defineStore('trainings', {
  state: () => ({
    trainings: [],
    selectedTraining: null,
  }),
  actions: {
    async fetchTrainings() {
      if (this.trainings.length > 0) {
        // If trainings are already loaded, do not fetch again
        return
      }
      try {
        console.log('Fetching trainings...')
        const res = await axios.get(backend_url+'/trainings/my-trainings', { withCredentials: true })

        if(res.status === 401) await router.push('/login') // Redirect to login if unauthorized

        //const res = { data: generateMockupTrainingsForOnePerson() } // Mockup data for testing
        console.log('Fetched trainings:', JSON.stringify(res.data, null, 2))
        this.trainings = res.data
        this.saveToLocalStorage()
      } catch (err) {
        console.error('Error fetching trainings:', err.message)
      }
    },
    async addTraining(training) {

      const res = await axios.post(backend_url + '/trainings/add-training', training, {withCredentials: true})
      if(!res.status === 200) { alert('Error adding training: ' + res.statusText); return; }
      training.id = res.data.id
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

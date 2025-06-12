import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null
  }),
  actions: {
    async login(email, password) {
      try {
        const res = await axios.post('/api/login', { email, password })
        this.token = res.data.token
        this.user = res.data.user
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
      } catch (err) {
        alert('Błędne dane logowania' + err.message);
      }
    },
    logout() {
      this.user = null
      this.token = null
      delete axios.defaults.headers.common['Authorization']
    }
  }
})

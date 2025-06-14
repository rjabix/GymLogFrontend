import { defineStore } from 'pinia'
import axios from 'axios'
import User from "@/models/user.js"

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: User,
    token: null,
    role: null,
  }),
  actions: {
    async login(email, password) {
      function getMockupData() {
        return {
          data: {
            token: 'mocked_token_12345',
            user: {
              id: 1,
              name: 'John',
              surname: 'Doe',
              email: 'john.doe@example.com',
              role: 'admin',
              weight: 75,
              height: 180,
              birth_date: '1990-01-01',
              profile_picture: 'https://example.com/profile.jpg',
              gender: 'male',
              is_active: true
            }
          }
        }
      }

      try {
        console.log("Fetching user data for login...")
        //TODO : uncomment when ready: res = await axios.post('/api/login', { email, password })
        const res = getMockupData() // Mockup data for testing
        this.token = res.data.token
        this.user = new User(
          res.data.user.id,
          res.data.user.name,
          res.data.user.surname,
          res.data.user.email,
          res.data.user.role,
          res.data.user.weight,
          res.data.user.height,
          res.data.user.birth_date,
          res.data.user.profile_picture,
          res.data.user.gender,
          res.data.user.is_active
        )
        this.role = this.user.role
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
        this.saveToLocalStorage() // Save state to localStorage
      } catch (err) {
        alert('Błędne dane logowania' + err.message)
      }
    },
    logout() {
      this.user = null
      this.token = null
      this.role = null
      delete axios.defaults.headers.common['Authorization']
      this.saveToLocalStorage() // Clear state in localStorage
    },
    saveToLocalStorage() {
      const state = {
        user: this.user,
        token: this.token,
        role: this.role,
      }
      localStorage.setItem('authStore', JSON.stringify(state))
    },
    loadFromLocalStorage() {
      const savedState = localStorage.getItem('authStore')
      if (savedState) {
        const { user, token, role } = JSON.parse(savedState)
        this.user = user ? new User(
          user.id,
          user.name,
          user.surname,
          user.email,
          user.role,
          user.weight,
          user.height,
          user.birth_date,
          user.profile_picture,
          user.gender,
          user.is_active
        ) : null
        this.token = token
        this.role = role
        if (this.token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
        }
      }
    }
  }
})

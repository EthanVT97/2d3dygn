import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token'),
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.is_admin === 1,
    userBalance: (state) => state.user?.balance || 0,
  },

  actions: {
    async login(credentials) {
      try {
        const response = await axios.post('/api/login', credentials)
        this.setAuth(response.data)
        return response
      } catch (error) {
        throw error
      }
    },

    async register(userData) {
      try {
        const response = await axios.post('/api/register', userData)
        this.setAuth(response.data)
        return response
      } catch (error) {
        throw error
      }
    },

    async logout() {
      try {
        await axios.post('/api/logout')
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        this.clearAuth()
      }
    },

    async fetchUser() {
      try {
        const response = await axios.get('/api/user')
        this.user = response.data
        return response
      } catch (error) {
        this.clearAuth()
        throw error
      }
    },

    setAuth(data) {
      this.token = data.token
      this.user = data.user
      localStorage.setItem('token', data.token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
    },

    clearAuth() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
    },

    async initAuth() {
      if (this.token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
        try {
          await this.fetchUser()
        } catch (error) {
          this.clearAuth()
        }
      }
    }
  }
})

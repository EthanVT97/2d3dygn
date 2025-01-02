import { defineStore } from 'pinia'
import axios from 'axios'
import { API_BASE_URL } from '../config/api'

// Create axios instance with base URL and credentials
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
})

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
        // Get CSRF cookie first
        await api.get('/sanctum/csrf-cookie')
        const response = await api.post('/api/login', credentials)
        this.setAuth(response.data)
        return response
      } catch (error) {
        console.error('Login error:', error)
        throw error
      }
    },

    async register(userData) {
      try {
        // Get CSRF cookie first
        await api.get('/sanctum/csrf-cookie')
        const response = await api.post('/api/register', userData)
        this.setAuth(response.data)
        return response
      } catch (error) {
        console.error('Register error:', error)
        throw error
      }
    },

    async logout() {
      try {
        await api.post('/api/logout')
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        this.clearAuth()
      }
    },

    async fetchUser() {
      try {
        const response = await api.get('/api/user')
        this.user = response.data
        return response
      } catch (error) {
        console.error('Fetch user error:', error)
        this.clearAuth()
        throw error
      }
    },

    setAuth(data) {
      if (data.token) {
        this.token = data.token
        localStorage.setItem('token', data.token)
        api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
      }
      if (data.user) {
        this.user = data.user
      }
    },

    clearAuth() {
      this.user = null
      this.token = null
      localStorage.removeItem('token')
      delete api.defaults.headers.common['Authorization']
    },

    async initAuth() {
      const token = localStorage.getItem('token')
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        try {
          await this.fetchUser()
        } catch (error) {
          this.clearAuth()
        }
      }
    }
  }
})

// Export the api instance for use in other stores
export { api }

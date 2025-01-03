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
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.is_admin === 1,
    userBalance: (state) => state.user?.balance || 0,
  },

  actions: {
    async login(credentials) {
      this.loading = true
      this.error = null
      
      try {
        // Check if API is responding
        try {
          const response = await axios.get('/api/matches')
          if (!response.data) {
            throw new Error('Invalid response from server')
          }
        } catch (error) {
          if (error.response?.status === 500) {
            throw new Error('The server is currently experiencing issues. Please try again later.')
          } else if (!error.response) {
            throw new Error('Unable to connect to the server. Please check your internet connection.')
          }
        }

        // Get CSRF cookie
        await api.get('/sanctum/csrf-cookie')
        
        // Attempt login
        const loginResponse = await api.post('/api/login', credentials)
        
        if (!loginResponse.data?.token) {
          throw new Error('Invalid response from server: No token received')
        }

        // Set token in axios headers
        api.defaults.headers.common['Authorization'] = `Bearer ${loginResponse.data.token}`
        
        // Store token and user data
        localStorage.setItem('token', loginResponse.data.token)
        this.token = loginResponse.data.token
        this.user = loginResponse.data.user
        
        return loginResponse
      } catch (error) {
        this.error = error.response?.data?.message || error.message
        throw error
      } finally {
        this.loading = false
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
        if (this.token) {
          await api.post('/api/logout')
        }
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
        if (error.response?.status === 401) {
          this.clearAuth()
        }
        throw error
      }
    },

    setAuth(data) {
      if (data.token) {
        localStorage.setItem('token', data.token)
        this.token = data.token
        api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
      }
      if (data.user) {
        this.user = data.user
      }
    },

    clearAuth() {
      localStorage.removeItem('token')
      this.token = null
      this.user = null
      delete api.defaults.headers.common['Authorization']
    },

    async initAuth() {
      const token = localStorage.getItem('token')
      if (token) {
        this.token = token
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

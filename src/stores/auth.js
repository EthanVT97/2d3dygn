import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
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

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token'))
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Computed properties
  const isAuthenticated = computed(() => !!token.value)
  const isLoading = computed(() => loading.value)
  const getError = computed(() => error.value)
  const getUser = computed(() => user.value)

  // Actions
  async function login(credentials) {
    loading.value = true
    error.value = null

    try {
      // Check API health first
      const healthCheck = await api.get('/api/health-check').catch(() => null)
      if (!healthCheck) {
        throw new Error('API server is not responding. Please try again later.')
      }

      // Get CSRF cookie
      await api.get('/sanctum/csrf-cookie')
      
      // Attempt login
      const response = await api.post('/api/login', credentials)
      
      if (!response.data?.token) {
        throw new Error('Invalid response from server: No token received')
      }

      // Store token and user data
      token.value = response.data.token
      user.value = response.data.user
      localStorage.setItem('token', response.data.token)
      
      // Set axios default header
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`

      return response
    } catch (e) {
      let errorMessage = 'Login failed'
      
      if (e.response?.data?.message) {
        errorMessage = e.response.data.message
      } else if (e.message) {
        errorMessage = e.message
      }
      
      error.value = errorMessage
      throw new Error(errorMessage)
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    loading.value = true
    error.value = null

    try {
      if (token.value) {
        await api.post('/api/logout')
      }
    } catch (e) {
      console.error('Logout error:', e)
    } finally {
      // Clear state regardless of API call success
      token.value = null
      user.value = null
      localStorage.removeItem('token')
      delete api.defaults.headers.common['Authorization']
      loading.value = false
    }
  }

  async function checkAuth() {
    if (!token.value) {
      return false
    }

    try {
      const response = await api.get('/api/user')
      user.value = response.data
      return true
    } catch (e) {
      if (e.response?.status === 401) {
        // Token is invalid
        await logout()
      }
      return false
    }
  }

  async function register(userData) {
    try {
      // Get CSRF cookie first
      await api.get('/sanctum/csrf-cookie')
      const response = await api.post('/api/register', userData)
      token.value = response.data.token
      user.value = response.data.user
      localStorage.setItem('token', response.data.token)
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
      return response
    } catch (error) {
      console.error('Register error:', error)
      throw error
    }
  }

  async function fetchUser() {
    try {
      const response = await api.get('/api/user')
      user.value = response.data
      return response
    } catch (error) {
      if (error.response?.status === 401) {
        await logout()
      }
      throw error
    }
  }

  // Initialize
  if (token.value) {
    checkAuth()
  }

  return {
    // State
    token,
    user,
    loading,
    error,

    // Getters
    isAuthenticated,
    isLoading,
    getError,
    getUser,

    // Actions
    login,
    logout,
    checkAuth,
    register,
    fetchUser
  }
})

// Export the api instance for use in other stores
export { api }

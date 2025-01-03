import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import './style.css'

const API_URL = process.env.VITE_API_BASE_URL || 'https://myanmar-betting-api.onrender.com'

// Configure axios
axios.defaults.baseURL = API_URL
axios.defaults.withCredentials = true
axios.defaults.headers.common['Accept'] = 'application/json'
axios.defaults.headers.common['Content-Type'] = 'application/json'

// Add request interceptor
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    console.error('Request failed:', error.message)
    return Promise.reject(error)
  }
)

// Add response interceptor
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // Server responded with error
      switch (error.response.status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('token')
          router.push('/login')
          break
        case 403:
          // Forbidden
          router.push('/forbidden')
          break
        case 500:
          console.error('Server error:', error.response.data)
          break
      }
    } else if (error.request) {
      // Request made but no response
      console.error('No response from server')
    } else {
      // Request setup error
      console.error('Request setup failed:', error.message)
    }
    return Promise.reject(error)
  }
)

// Create app
const app = createApp(App)

// Global error handler
app.config.errorHandler = (error, vm, info) => {
  console.error('Vue Error:', error)
  console.error('Component:', vm)
  console.error('Info:', info)
}

// Use plugins
app.use(createPinia())
app.use(router)

app.mount('#app')

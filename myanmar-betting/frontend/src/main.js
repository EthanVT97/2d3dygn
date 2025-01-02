import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import './style.css'

// Configure axios
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
axios.defaults.withCredentials = true

// Create app
const app = createApp(App)

// Use plugins
app.use(createPinia())
app.use(router)

// Mount app
app.mount('#app')

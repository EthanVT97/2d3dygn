import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import Toast, { options as toastOptions } from './plugins/toast'
import dayjs from 'dayjs'
import 'dayjs/locale/my'
import './style.css'

// Configure dayjs
dayjs.locale('my')

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
          app.$toast.error('ကျေးဇူးပြု၍ အကောင့်ပြန်ဝင်ပါ')
          break
        case 403:
          // Forbidden
          router.push('/forbidden')
          app.$toast.error('ခွင့်ပြုချက်မရှိပါ')
          break
        case 404:
          // Not found
          router.push('/not-found')
          app.$toast.error('တောင်းဆိုသည့်စာမျက်နှာကို ရှာမတွေ့ပါ')
          break
        case 422:
          // Validation error
          app.$toast.error(error.response.data.message || 'ထည့်သွင်းထားသောအချက်အလက်များ မှားယွင်းနေပါသည်')
          break
        case 429:
          // Too many requests
          app.$toast.error('တောင်းဆိုမှုများလွန်းနေပါသည်။ ခဏစောင့်ပြီးပြန်လည်ကြိုးစားပါ')
          break
        case 500:
          // Server error
          app.$toast.error('ဆာဗာပြဿနာရှိနေပါသည်။ ခဏစောင့်ပြီးပြန်လည်ကြိုးစားပါ')
          console.error('Server error:', error.response.data)
          break
        default:
          app.$toast.error('မမျှော်လင့်ထားသောအမှား ဖြစ်ပွားခဲ့သည်')
      }
    } else if (error.request) {
      // Request made but no response
      app.$toast.error('ဆာဗာနှင့်ဆက်သွယ်၍မရပါ။ အင်တာနက်ချိတ်ဆက်မှုကို စစ်ဆေးပါ')
      console.error('No response from server')
    } else {
      // Request setup error
      app.$toast.error('တောင်းဆိုမှုပြုလုပ်ရာတွင် အမှားရှိနေပါသည်')
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
  app.$toast.error('မမျှော်လင့်ထားသောအမှား ဖြစ်ပွားခဲ့သည်')
}

// Use plugins
app.use(createPinia())
app.use(router)
app.use(Toast, toastOptions)

// Mount app
app.mount('#app')

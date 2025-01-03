<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900">
    <div class="max-w-md w-full space-y-8">
      <div class="bg-gray-800 shadow-2xl rounded-2xl p-8 backdrop-blur-lg bg-opacity-90">
        <!-- Logo/Header -->
        <div class="text-center mb-8">
          <img class="mx-auto h-16 w-auto mb-4" src="/logo.png" alt="Logo" />
          <h2 class="text-3xl font-extrabold text-white mb-2">အကောင့်ဝင်ရန်</h2>
          <p class="text-sm text-gray-300">
            သို့မဟုတ်
            <router-link to="/register" class="font-medium text-blue-400 hover:text-blue-300 transition-colors">
              အကောင့်အသစ်ဖွင့်မည်
            </router-link>
          </p>
        </div>

        <!-- Alert for errors -->
        <div v-if="errorMessage" class="mb-4 p-4 rounded-lg bg-red-900 bg-opacity-50 text-red-200 text-sm">
          {{ errorMessage }}
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Phone Input -->
          <div>
            <label for="phone" class="block text-sm font-medium text-gray-200">ဖုန်းနံပါတ်</label>
            <div class="mt-1 relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="fas fa-phone text-gray-400"></i>
              </div>
              <input
                id="phone"
                v-model="form.phone"
                type="tel"
                required
                class="appearance-none block w-full px-3 py-2 pl-10 border border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white"
                :class="{ 'border-red-500 focus:ring-red-500': errors.phone }"
                placeholder="09xxxxxxxxx"
              />
            </div>
            <p v-if="errors.phone" class="mt-1 text-sm text-red-400">{{ errors.phone }}</p>
          </div>

          <!-- Password Input -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-200">စကားဝှက်</label>
            <div class="mt-1 relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="fas fa-lock text-gray-400"></i>
              </div>
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="appearance-none block w-full px-3 py-2 pl-10 border border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white"
                :class="{ 'border-red-500 focus:ring-red-500': errors.password }"
                placeholder="စကားဝှက်ထည့်ပါ"
              />
              <button
                type="button"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200 transition-colors"
                @click="togglePassword"
              >
                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
            <p v-if="errors.password" class="mt-1 text-sm text-red-400">{{ errors.password }}</p>
          </div>

          <!-- Remember Me & Forgot Password -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember"
                v-model="form.remember"
                type="checkbox"
                class="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
              />
              <label for="remember" class="ml-2 block text-sm text-gray-300">
                အကောင့်မှတ်ထားမည်
              </label>
            </div>
            <div class="text-sm">
              <router-link to="/forgot-password" class="font-medium text-blue-400 hover:text-blue-300 transition-colors">
                စကားဝှက်မေ့နေပါသလား?
              </router-link>
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
            :class="{ 'opacity-75 cursor-not-allowed': isLoading }"
            :disabled="isLoading"
          >
            <span v-if="isLoading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              ခဏစောင့်ပါ...
            </span>
            <span v-else>အကောင့်ဝင်မည်</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const form = reactive({
  phone: '',
  password: '',
  remember: false
})

const errors = reactive({})
const isLoading = ref(false)
const showPassword = ref(false)
const errorMessage = ref('')

const validateForm = () => {
  errors.phone = ''
  errors.password = ''
  
  if (!form.phone) {
    errors.phone = 'ဖုန်းနံပါတ်ထည့်ပါ'
    return false
  }
  
  if (!form.password) {
    errors.password = 'စကားဝှက်ထည့်ပါ'
    return false
  }
  
  return true
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    await auth.login({
      phone: form.phone,
      password: form.password,
      remember: form.remember
    })
    router.push('/')
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'အကောင့်ဝင်ရာတွင် အမှားရှိနေပါသည်။ ထပ်မံကြိုးစားကြည့်ပါ။'
    if (error.response?.data?.errors) {
      Object.assign(errors, error.response.data.errors)
    }
  } finally {
    isLoading.value = false
  }
}

const togglePassword = () => {
  showPassword.value = !showPassword.value
}
</script>

<style>
.bg-gradient-to-r {
  background-size: 200% 200%;
  animation: gradient 15s ease infinite;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>

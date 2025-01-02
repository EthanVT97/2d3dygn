<template>
  <div class="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100">
    <div class="card max-w-md w-full space-y-8 p-8">
      <div class="text-center">
        <h2 class="text-3xl font-extrabold text-gray-900">
          အကောင့်ဝင်ရန်
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          သို့မဟုတ်
          <router-link to="/register" class="font-medium text-primary hover:text-primary-dark">
            အကောင့်အသစ်ဖွင့်မည်
          </router-link>
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <!-- Phone Input -->
          <div>
            <label for="phone" class="form-label">ဖုန်းနံပါတ်</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </div>
              <input 
                id="phone" 
                v-model="phone" 
                type="tel" 
                required 
                class="form-input pl-10" 
                placeholder="09xxxxxxxxx"
                :class="{ 'border-danger': errors.phone }"
              />
            </div>
            <p v-if="errors.phone" class="mt-1 text-sm text-danger">{{ errors.phone }}</p>
          </div>

          <!-- Password Input -->
          <div>
            <label for="password" class="form-label">စကားဝှက်</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                </svg>
              </div>
              <input 
                id="password" 
                v-model="password" 
                :type="showPassword ? 'text' : 'password'" 
                required 
                class="form-input pl-10 pr-10" 
                placeholder="စကားဝှက်ထည့်ပါ"
                :class="{ 'border-danger': errors.password }"
              />
              <button 
                type="button"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
                @click="togglePassword"
              >
                <svg 
                  v-if="showPassword"
                  xmlns="http://www.w3.org/2000/svg" 
                  class="h-5 w-5 text-gray-400 hover:text-gray-600" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd" />
                  <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                </svg>
                <svg 
                  v-else
                  xmlns="http://www.w3.org/2000/svg" 
                  class="h-5 w-5 text-gray-400 hover:text-gray-600" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
            <p v-if="errors.password" class="mt-1 text-sm text-danger">{{ errors.password }}</p>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input 
              id="remember-me" 
              v-model="rememberMe" 
              type="checkbox" 
              class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded cursor-pointer"
            />
            <label for="remember-me" class="ml-2 block text-sm text-gray-900 cursor-pointer">
              အကောင့်မှတ်ထားမည်
            </label>
          </div>

          <div class="text-sm">
            <router-link to="/forgot-password" class="font-medium text-primary hover:text-primary-dark">
              စကားဝှက်မေ့နေပါသလား?
            </router-link>
          </div>
        </div>

        <div>
          <button 
            type="submit" 
            class="btn btn-primary w-full"
            :disabled="loading"
          >
            <svg 
              v-if="loading"
              class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ loading ? 'ဝင်နေသည်...' : 'အကောင့်ဝင်မည်' }}
          </button>
        </div>
      </form>

      <!-- Alert Messages -->
      <div v-if="error" class="alert alert-danger" role="alert">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const phone = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')
const errors = ref({})

function togglePassword() {
  showPassword.value = !showPassword.value
}

function validateForm() {
  errors.value = {}
  let isValid = true

  // Phone validation
  if (!phone.value) {
    errors.value.phone = 'ဖုန်းနံပါတ်ထည့်ပါ'
    isValid = false
  } else if (!/^09\d{9}$/.test(phone.value)) {
    errors.value.phone = 'မှန်ကန်သောဖုန်းနံပါတ်ထည့်ပါ'
    isValid = false
  }

  // Password validation
  if (!password.value) {
    errors.value.password = 'စကားဝှက်ထည့်ပါ'
    isValid = false
  } else if (password.value.length < 6) {
    errors.value.password = 'စကားဝှက်သည်အနည်းဆုံး ၆ လုံးရှိရမည်'
    isValid = false
  }

  return isValid
}

async function handleSubmit() {
  if (!validateForm()) return

  loading.value = true
  error.value = ''

  try {
    await auth.login({
      phone: phone.value,
      password: password.value,
      rememberMe: rememberMe.value
    })
    router.push('/')
  } catch (err) {
    error.value = err.message || 'အကောင့်ဝင်ရာတွင်အမှားရှိနေပါသည်'
  } finally {
    loading.value = false
  }
}
</script>

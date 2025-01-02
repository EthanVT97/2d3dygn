<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
    <div class="max-w-md w-full">
      <div class="card p-8 bg-gray-900 rounded-lg shadow-lg">
        <!-- Header -->
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold">အကောင့်ဝင်ရန်</h2>
          <p class="mt-2 text-sm text-gray-400">
            သို့မဟုတ်
            <router-link to="/register" class="font-medium text-primary hover:text-primary-dark">
              အကောင့်အသစ်ဖွင့်မည်
            </router-link>
          </p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Phone Input -->
          <div>
            <label for="phone" class="form-label">ဖုန်းနံပါတ်</label>
            <div class="relative">
              <span 
                class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400"
              >
                <i class="fas fa-phone"></i>
              </span>
              <input
                id="phone"
                v-model="form.phone"
                type="tel"
                required
                class="form-input pl-10"
                :class="{ 'error': errors.phone }"
                placeholder="09xxxxxxxxx"
              />
            </div>
            <p v-if="errors.phone" class="mt-1 text-sm text-error">
              {{ errors.phone }}
            </p>
          </div>

          <!-- Password Input -->
          <div>
            <label for="password" class="form-label">စကားဝှက်</label>
            <div class="relative">
              <span 
                class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400"
              >
                <i class="fas fa-lock"></i>
              </span>
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="form-input pl-10"
                :class="{ 'error': errors.password }"
                placeholder="စကားဝှက်ထည့်ပါ"
              />
              <button
                type="button"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-primary"
                @click="togglePassword"
              >
                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
            <p v-if="errors.password" class="mt-1 text-sm text-error">
              {{ errors.password }}
            </p>
          </div>

          <!-- Remember Me & Forgot Password -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember"
                v-model="form.remember"
                type="checkbox"
                class="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <label for="remember" class="ml-2 block text-sm text-gray-400">
                အကောင့်မှတ်ထားမည်
              </label>
            </div>
            <div class="text-sm">
              <router-link 
                to="/forgot-password"
                class="font-medium text-primary hover:text-primary-dark"
              >
                စကားဝှက်မေ့နေပါသလား?
              </router-link>
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="btn btn-primary w-full"
            :class="{ 'opacity-75 cursor-not-allowed': isLoading }"
            :disabled="isLoading"
          >
            <span v-if="isLoading" class="flex items-center justify-center">
              <i class="fas fa-spinner fa-spin mr-2"></i>
              ဝင်နေသည်...
            </span>
            <span v-else>အကောင့်ဝင်မည်</span>
          </button>

          <!-- Register Link -->
          <p class="mt-4 text-center text-sm text-gray-400">
            အကောင့်မရှိပါက
            <router-link 
              to="/register"
              class="font-medium text-primary hover:text-primary-dark"
            >
              အကောင့်အသစ်ဖွင့်မည်
            </router-link>
          </p>
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

const errors = reactive({
  phone: '',
  password: ''
})

const isLoading = ref(false)
const showPassword = ref(false)

function validateForm() {
  let isValid = true
  
  // Reset errors
  errors.phone = ''
  errors.password = ''
  
  // Validate phone
  if (!form.phone) {
    errors.phone = 'ဖုန်းနံပါတ်ထည့်ပါ'
    isValid = false
  } else if (!/^09\d{9}$/.test(form.phone)) {
    errors.phone = 'မှန်ကန်သောဖုန်းနံပါတ်ထည့်ပါ'
    isValid = false
  }
  
  // Validate password
  if (!form.password) {
    errors.password = 'စကားဝှက်ထည့်ပါ'
    isValid = false
  } else if (form.password.length < 6) {
    errors.password = 'စကားဝှက်သည်အနည်းဆုံး ၆ လုံးရှိရမည်'
    isValid = false
  }
  
  return isValid
}

async function handleSubmit() {
  if (!validateForm()) return
  
  isLoading.value = true
  
  try {
    await auth.login({
      phone: form.phone,
      password: form.password,
      remember: form.remember
    })
    router.push('/')
  } catch (error) {
    if (error.response?.data?.message) {
      errors.password = error.response.data.message
    } else {
      errors.password = 'အကောင့်ဝင်ရာတွင်အမှားရှိနေပါသည်'
    }
  } finally {
    isLoading.value = false
  }
}

function togglePassword() {
  showPassword.value = !showPassword.value
}
</script>

<style scoped>
.form-input {
  @apply block w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-2 text-white focus:border-primary focus:ring-primary;
}

.form-input.error {
  @apply border-red-500;
}

.form-label {
  @apply block text-sm font-medium text-gray-300 mb-1;
}

.btn {
  @apply py-2 px-4 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2;
}

.btn-primary {
  @apply bg-primary text-white hover:bg-primary-dark focus:ring-primary;
}

.text-error {
  @apply text-red-500;
}
</style>

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
                :disabled="isLoading"
                class="appearance-none block w-full px-3 py-2 pl-10 border border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white disabled:opacity-50"
                :class="{ 'border-red-500 focus:ring-red-500': errors.phone }"
                placeholder="09xxxxxxxxx"
                pattern="^09\d{7,9}$"
                @input="validatePhone"
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
                :disabled="isLoading"
                class="appearance-none block w-full px-3 py-2 pl-10 pr-10 border border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white disabled:opacity-50"
                :class="{ 'border-red-500 focus:ring-red-500': errors.password }"
                placeholder="စကားဝှက်ထည့်ပါ"
                minlength="8"
              />
              <button
                type="button"
                @click="togglePassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
                :disabled="isLoading"
              >
                <i :class="['fas', showPassword ? 'fa-eye-slash' : 'fa-eye', 'text-gray-400']"></i>
              </button>
            </div>
            <p v-if="errors.password" class="mt-1 text-sm text-red-400">{{ errors.password }}</p>
          </div>

          <!-- Submit Button -->
          <div>
            <button
              type="submit"
              :disabled="isLoading || !isFormValid"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                <i class="fas fa-sign-in-alt text-blue-500 group-hover:text-blue-400"></i>
              </span>
              <span v-if="isLoading" class="flex items-center">
                <i class="fas fa-spinner fa-spin mr-2"></i>
                လုပ်ဆောင်နေသည်...
              </span>
              <span v-else>အကောင့်ဝင်မည်</span>
            </button>
          </div>

          <!-- Forgot Password Link -->
          <div class="text-center">
            <router-link to="/forgot-password" class="text-sm text-blue-400 hover:text-blue-300 transition-colors">
              စကားဝှက်မေ့နေပါသလား?
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const form = reactive({
  phone: '',
  password: ''
})

const errors = reactive({
  phone: '',
  password: ''
})

const showPassword = ref(false)
const errorMessage = ref('')
const isLoading = computed(() => auth.isLoading)

// Form validation
const isFormValid = computed(() => {
  return form.phone && form.password && !errors.phone && !errors.password
})

function validatePhone() {
  const phonePattern = /^09\d{7,9}$/
  if (!form.phone) {
    errors.phone = 'ဖုန်းနံပါတ်ထည့်ပါ'
  } else if (!phonePattern.test(form.phone)) {
    errors.phone = 'မှန်ကန်သောဖုန်းနံပါတ်ထည့်ပါ (09xxxxxxxxx)'
  } else {
    errors.phone = ''
  }
}

async function handleSubmit() {
  try {
    // Clear previous errors
    errorMessage.value = ''
    errors.phone = ''
    errors.password = ''

    // Validate phone
    validatePhone()
    if (errors.phone) return

    // Validate password
    if (form.password.length < 8) {
      errors.password = 'စကားဝှက်သည် အနည်းဆုံး ၈ လုံးရှိရမည်'
      return
    }

    // Attempt login
    await auth.login(form)
    router.push('/')
  } catch (error) {
    errorMessage.value = error.message || 'အကောင့်ဝင်ရာတွင် အမှားရှိနေပါသည်'
    console.error('Login error:', error)
  }
}

function togglePassword() {
  showPassword.value = !showPassword.value
}
</script>

<style scoped>
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

/* Glass effect */
.backdrop-blur-lg {
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}
</style>

<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900">
    <div class="max-w-md w-full space-y-8">
      <div class="bg-gray-800 shadow-2xl rounded-2xl p-8 backdrop-blur-lg bg-opacity-90 transform transition-all duration-300 hover:scale-[1.02]">
        <!-- Logo/Header -->
        <div class="text-center mb-8">
          <img class="mx-auto h-16 w-auto mb-4 animate-bounce" src="/logo.png" alt="Logo" />
          <h2 class="text-3xl font-extrabold text-white mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">အကောင့်ဝင်ရန်</h2>
          <p class="text-sm text-gray-300">
            သို့မဟုတ်
            <router-link to="/register" class="font-medium text-blue-400 hover:text-blue-300 transition-colors duration-300 hover:underline">
              အကောင့်အသစ်ဖွင့်မည်
            </router-link>
          </p>
        </div>

        <!-- Alert for errors -->
        <TransitionGroup name="fade">
          <div v-if="errorMessage" key="error" class="mb-4 p-4 rounded-lg bg-red-900 bg-opacity-50 text-red-200 text-sm flex items-center justify-between">
            <div class="flex items-center">
              <i class="fas fa-exclamation-circle mr-2"></i>
              {{ errorMessage }}
            </div>
            <button @click="errorMessage = ''" class="text-red-200 hover:text-red-100">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div v-if="showSuccessMessage" key="success" class="mb-4 p-4 rounded-lg bg-green-900 bg-opacity-50 text-green-200 text-sm flex items-center">
            <i class="fas fa-check-circle mr-2"></i>
            အကောင့်ဝင်ရောက်မှု အောင်မြင်ပါသည်
          </div>
        </TransitionGroup>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-6" autocomplete="off">
          <!-- Phone Input -->
          <div>
            <label for="phone" class="block text-sm font-medium text-gray-200 mb-1">ဖုန်းနံပါတ်</label>
            <div class="mt-1 relative group">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-500">
                <i class="fas fa-phone text-gray-400 group-focus-within:text-blue-500"></i>
              </div>
              <input
                id="phone"
                v-model="form.phone"
                type="tel"
                required
                :disabled="isLoading"
                class="appearance-none block w-full px-3 py-2 pl-10 border border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white disabled:opacity-50 transition-all"
                :class="{ 'border-red-500 focus:ring-red-500': errors.phone }"
                placeholder="09xxxxxxxxx"
                pattern="^09\d{7,9}$"
                @input="validatePhone"
                @focus="errors.phone = ''"
              />
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center" v-if="form.phone">
                <i class="fas fa-check text-green-500" v-if="!errors.phone"></i>
                <i class="fas fa-times text-red-500" v-else></i>
              </div>
            </div>
            <TransitionGroup name="fade">
              <p v-if="errors.phone" key="error" class="mt-1 text-sm text-red-400 flex items-center">
                <i class="fas fa-exclamation-circle mr-1"></i>
                {{ errors.phone }}
              </p>
              <p v-else-if="form.phone && !errors.phone" key="valid" class="mt-1 text-sm text-green-400 flex items-center">
                <i class="fas fa-check-circle mr-1"></i>
                မှန်ကန်သောဖုန်းနံပါတ်ဖြစ်ပါသည်
              </p>
            </TransitionGroup>
          </div>

          <!-- Password Input -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-200 mb-1">စကားဝှက်</label>
            <div class="mt-1 relative group">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="fas fa-lock text-gray-400 group-focus-within:text-blue-500"></i>
              </div>
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                :disabled="isLoading"
                class="appearance-none block w-full px-3 py-2 pl-10 pr-10 border border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white disabled:opacity-50 transition-all"
                :class="{ 'border-red-500 focus:ring-red-500': errors.password }"
                placeholder="စကားဝှက်ထည့်ပါ"
                minlength="8"
                @focus="errors.password = ''"
              />
              <button
                type="button"
                @click="togglePassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300 focus:outline-none"
                :disabled="isLoading"
              >
                <i :class="['fas', showPassword ? 'fa-eye-slash' : 'fa-eye', 'transition-all']"></i>
              </button>
            </div>
            <TransitionGroup name="fade">
              <p v-if="errors.password" key="error" class="mt-1 text-sm text-red-400 flex items-center">
                <i class="fas fa-exclamation-circle mr-1"></i>
                {{ errors.password }}
              </p>
              <p v-else-if="form.password.length >= 8" key="valid" class="mt-1 text-sm text-green-400 flex items-center">
                <i class="fas fa-check-circle mr-1"></i>
                စကားဝှက်အရှည်လုံလောက်ပါသည်
              </p>
            </TransitionGroup>
          </div>

          <!-- Submit Button -->
          <div>
            <button
              type="submit"
              :disabled="isLoading || !isFormValid"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02]"
            >
              <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                <i class="fas fa-sign-in-alt text-blue-300 group-hover:text-blue-200 transition-colors"></i>
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
            <router-link to="/forgot-password" class="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-300 hover:underline inline-flex items-center">
              <i class="fas fa-key mr-1"></i>
              စကားဝှက်မေ့နေပါသလား?
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const toast = useToast()

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
const showSuccessMessage = ref(false)
const isLoading = computed(() => auth.isLoading)

// Form validation
const isFormValid = computed(() => {
  return form.phone && form.password && !errors.phone && !errors.password && form.password.length >= 8
})

// Phone validation with debounce
let phoneTimeout
function validatePhone() {
  clearTimeout(phoneTimeout)
  phoneTimeout = setTimeout(() => {
    const phonePattern = /^09\d{7,9}$/
    if (!form.phone) {
      errors.phone = 'ဖုန်းနံပါတ်ထည့်ပါ'
    } else if (!phonePattern.test(form.phone)) {
      errors.phone = 'မှန်ကန်သောဖုန်းနံပါတ်ထည့်ပါ (09xxxxxxxxx)'
    } else {
      errors.phone = ''
    }
  }, 300)
}

// Password validation
watch(() => form.password, (newVal) => {
  if (newVal.length > 0 && newVal.length < 8) {
    errors.password = 'စကားဝှက်သည် အနည်းဆုံး ၈ လုံးရှိရမည်'
  } else {
    errors.password = ''
  }
})

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

    // Show loading state
    isLoading.value = true

    // Attempt login
    await auth.login(form)
    
    // Show success message
    showSuccessMessage.value = true
    toast.success('အကောင့်ဝင်ရောက်မှု အောင်မြင်ပါသည်')

    // Redirect after a short delay
    setTimeout(() => {
      const redirectPath = route.query.redirect || '/'
      router.push(redirectPath)
    }, 1000)
  } catch (error) {
    errorMessage.value = error.message || 'အကောင့်ဝင်ရာတွင် အမှားရှိနေပါသည်'
    toast.error(errorMessage.value)
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

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Input focus styles */
input:focus {
  transform: scale(1.01);
}

/* Button loading animation */
.fa-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Hover effects */
.hover\:scale-\[1\.02\]:hover {
  transform: scale(1.02);
}

/* Success message animation */
@keyframes slideIn {
  from {
    transform: translateY(-10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.success-message {
  animation: slideIn 0.3s ease-out;
}
</style>

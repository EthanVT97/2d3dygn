<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full">
      <div class="bg-white shadow-lg rounded-2xl p-8 space-y-8">
        <div>
          <h1 class="text-center text-3xl font-bold">
            <span class="text-gradient">Myanmar Betting</span>
          </h1>
          <h2 class="mt-6 text-center text-2xl font-bold text-gray-900">
            အကောင့်အသစ်ဖွင့်ရန်
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            သို့မဟုတ်
            <router-link to="/login" class="font-medium text-primary hover:text-primary-dark transition-colors">
              အကောင့်ဝင်ရန်
            </router-link>
          </p>
        </div>

        <!-- Alert for errors -->
        <div v-if="error" class="alert alert-danger" role="alert">
          {{ error }}
        </div>

        <form class="space-y-6" @submit.prevent="handleRegister">
          <div class="space-y-4">
            <div>
              <label for="name" class="form-label">အမည်</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                  </svg>
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  v-model="name"
                  class="form-input pl-10"
                  placeholder="အမည်"
                >
              </div>
            </div>

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
                  name="phone"
                  type="tel"
                  required
                  v-model="phone"
                  class="form-input pl-10"
                  placeholder="09xxxxxxxxx"
                >
              </div>
            </div>

            <div>
              <label for="password" class="form-label">လျှို့ဝှက်နံပါတ်</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  v-model="password"
                  class="form-input pl-10"
                  placeholder="လျှို့ဝှက်နံပါတ်"
                  @input="validatePassword"
                >
                <button 
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 hover:text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd" />
                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 hover:text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
              <div v-if="passwordError" class="mt-1 text-sm text-red-600">
                {{ passwordError }}
              </div>
            </div>

            <div>
              <label for="password_confirmation" class="form-label">လျှို့ဝှက်နံပါတ် အတည်ပြုရန်</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                  </svg>
                </div>
                <input
                  id="password_confirmation"
                  name="password_confirmation"
                  :type="showPasswordConfirm ? 'text' : 'password'"
                  required
                  v-model="passwordConfirmation"
                  class="form-input pl-10"
                  placeholder="လျှို့ဝှက်နံပါတ် အတည်ပြုရန်"
                  @input="validatePasswordConfirmation"
                >
                <button 
                  type="button"
                  @click="showPasswordConfirm = !showPasswordConfirm"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg v-if="showPasswordConfirm" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 hover:text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd" />
                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 hover:text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
              <div v-if="passwordConfirmError" class="mt-1 text-sm text-red-600">
                {{ passwordConfirmError }}
              </div>
            </div>
          </div>

          <div>
            <label class="flex items-center">
              <input
                type="checkbox"
                required
                v-model="agreeToTerms"
                class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              >
              <span class="ml-2 block text-sm text-gray-900">
                <a href="#" class="text-primary hover:text-primary-dark transition-colors">စည်းမျဉ်းစည်းကမ်းများ</a>ကို လက်ခံပါသည်
              </span>
            </label>
          </div>

          <div>
            <button
              type="submit"
              class="btn btn-primary w-full shadow-lg shadow-primary/30 hover:shadow-primary/40"
              :disabled="loading || !isFormValid"
            >
              <svg
                v-if="loading"
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              {{ loading ? 'အကောင့်ဖွင့်နေသည်...' : 'အကောင့်ဖွင့်မည်' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const name = ref('')
const phone = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const agreeToTerms = ref(false)
const loading = ref(false)
const error = ref('')
const showPassword = ref(false)
const showPasswordConfirm = ref(false)
const passwordError = ref('')
const passwordConfirmError = ref('')

const validatePassword = () => {
  if (password.value.length < 6) {
    passwordError.value = 'လျှို့ဝှက်နံပါတ်သည် အနည်းဆုံး ၆ လုံး ရှိရပါမည်'
  } else {
    passwordError.value = ''
  }
  validatePasswordConfirmation()
}

const validatePasswordConfirmation = () => {
  if (passwordConfirmation.value && password.value !== passwordConfirmation.value) {
    passwordConfirmError.value = 'လျှို့ဝှက်နံပါတ်များ မတူညီပါ'
  } else {
    passwordConfirmError.value = ''
  }
}

const isFormValid = computed(() => {
  return name.value && 
         phone.value && 
         password.value && 
         passwordConfirmation.value && 
         agreeToTerms.value && 
         !passwordError.value && 
         !passwordConfirmError.value
})

async function handleRegister() {
  try {
    loading.value = true
    error.value = ''
    await auth.register({
      name: name.value,
      phone: phone.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value
    })
    router.push('/login')
  } catch (err) {
    error.value = err.response?.data?.message || 'Registration failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

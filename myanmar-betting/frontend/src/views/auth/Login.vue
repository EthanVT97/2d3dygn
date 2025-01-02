<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          အကောင့်ဝင်ရန်
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          သို့မဟုတ်
          <router-link to="/register" class="font-medium text-primary hover:text-blue-500">
            အကောင့်အသစ်ဖွင့်ရန်
          </router-link>
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="phone" class="sr-only">ဖုန်းနံပါတ်</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              v-model="phone"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              placeholder="ဖုန်းနံပါတ်"
            >
          </div>
          <div>
            <label for="password" class="sr-only">လျှို့ဝှက်နံပါတ်</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              v-model="password"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              placeholder="လျှို့ဝှက်နံပါတ်"
            >
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              v-model="rememberMe"
              class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            >
            <label for="remember-me" class="ml-2 block text-sm text-gray-900">
              မှတ်ထားမည်
            </label>
          </div>

          <div class="text-sm">
            <a href="#" class="font-medium text-primary hover:text-blue-500">
              လျှို့ဝှက်နံပါတ် မေ့နေပါသလား?
            </a>
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            :disabled="loading"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg
                v-if="!loading"
                class="h-5 w-5 text-blue-500 group-hover:text-blue-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clip-rule="evenodd"
                />
              </svg>
              <svg
                v-else
                class="animate-spin h-5 w-5 text-white"
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
            </span>
            {{ loading ? 'ဝင်ရောက်နေသည်...' : 'ဝင်ရောက်မည်' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Reactive state
const phone = ref('')
const password = ref('')
const rememberMe = ref(false)
const loading = ref(false)

// Login handler
const handleLogin = async () => {
  try {
    loading.value = true
    // TODO: Implement login logic with backend API
    console.log({
      phone: phone.value,
      password: password.value,
      rememberMe: rememberMe.value
    })
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Redirect to home page after successful login
    router.push('/')
  } catch (error) {
    console.error('Login failed:', error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          အကောင့်အသစ်ဖွင့်ရန်
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          သို့မဟုတ်
          <router-link to="/login" class="font-medium text-primary hover:text-blue-500">
            အကောင့်ဝင်ရန်
          </router-link>
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="name" class="sr-only">အမည်</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              v-model="name"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              placeholder="အမည်"
            >
          </div>
          <div>
            <label for="phone" class="sr-only">ဖုန်းနံပါတ်</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              v-model="phone"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
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
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              placeholder="လျှို့ဝှက်နံပါတ်"
            >
          </div>
          <div>
            <label for="password_confirmation" class="sr-only">လျှို့ဝှက်နံပါတ် အတည်ပြုရန်</label>
            <input
              id="password_confirmation"
              name="password_confirmation"
              type="password"
              required
              v-model="passwordConfirmation"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              placeholder="လျှို့ဝှက်နံပါတ် အတည်ပြုရန်"
            >
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
              <a href="#" class="text-primary hover:text-blue-500">စည်းမျဉ်းစည်းကမ်းများ</a>ကို လက်ခံပါသည်
            </span>
          </label>
        </div>

        <div>
          <button
            type="submit"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            :disabled="loading || !isFormValid"
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
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
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
            {{ loading ? 'စာရင်းသွင်းနေသည်...' : 'စာရင်းသွင်းမည်' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Reactive state
const name = ref('')
const phone = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const agreeToTerms = ref(false)
const loading = ref(false)

// Computed property to check if form is valid
const isFormValid = computed(() => {
  return (
    name.value.length >= 2 &&
    phone.value.length >= 9 &&
    password.value.length >= 6 &&
    password.value === passwordConfirmation.value &&
    agreeToTerms.value
  )
})

// Register handler
const handleRegister = async () => {
  if (!isFormValid.value) return

  try {
    loading.value = true
    // TODO: Implement registration logic with backend API
    console.log({
      name: name.value,
      phone: phone.value,
      password: password.value
    })
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Redirect to login page after successful registration
    router.push('/login')
  } catch (error) {
    console.error('Registration failed:', error)
  } finally {
    loading.value = false
  }
}
</script>

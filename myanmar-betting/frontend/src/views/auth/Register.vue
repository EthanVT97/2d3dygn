<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
    <div class="max-w-md w-full">
      <div class="card p-8 bg-gray-900 rounded-lg shadow-lg">
        <!-- Header -->
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold">Create Account</h2>
          <p class="mt-2 text-sm text-gray-400">
            Join Myanmar Betting today
          </p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Name Input -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <i class="fas fa-user"></i>
              </span>
              <input
                id="name"
                v-model="form.name"
                type="text"
                required
                class="block w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-2 text-white focus:border-primary focus:ring-primary pl-10"
                :class="{ 'border-red-500': errors.name }"
                placeholder="Enter your full name"
              />
            </div>
            <p v-if="errors.name" class="mt-1 text-sm text-red-500">
              {{ errors.name }}
            </p>
          </div>

          <!-- Phone Input -->
          <div>
            <label for="phone" class="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <i class="fas fa-phone"></i>
              </span>
              <input
                id="phone"
                v-model="form.phone"
                type="tel"
                required
                class="block w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-2 text-white focus:border-primary focus:ring-primary pl-10"
                :class="{ 'border-red-500': errors.phone }"
                placeholder="Enter your phone number"
              />
            </div>
            <p v-if="errors.phone" class="mt-1 text-sm text-red-500">
              {{ errors.phone }}
            </p>
          </div>

          <!-- Password Input -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <i class="fas fa-lock"></i>
              </span>
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="block w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-2 text-white focus:border-primary focus:ring-primary pl-10"
                :class="{ 'border-red-500': errors.password }"
                placeholder="Create a password"
              />
              <button
                type="button"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-primary"
                @click="togglePassword"
              >
                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
            <p v-if="errors.password" class="mt-1 text-sm text-red-500">
              {{ errors.password }}
            </p>
          </div>

          <!-- Confirm Password Input -->
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-300 mb-1">Confirm Password</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <i class="fas fa-lock"></i>
              </span>
              <input
                id="confirmPassword"
                v-model="form.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                required
                class="block w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-2 text-white focus:border-primary focus:ring-primary pl-10"
                :class="{ 'border-red-500': errors.confirmPassword }"
                placeholder="Confirm your password"
              />
              <button
                type="button"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-primary"
                @click="toggleConfirmPassword"
              >
                <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
            <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-500">
              {{ errors.confirmPassword }}
            </p>
          </div>

          <!-- Terms and Conditions -->
          <div class="flex items-center">
            <input
              id="terms"
              v-model="form.acceptTerms"
              type="checkbox"
              required
              class="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <label for="terms" class="ml-2 block text-sm text-gray-400">
              I agree to the 
              <router-link 
                to="/terms"
                class="font-medium text-primary hover:text-primary-dark"
              >
                Terms and Conditions
              </router-link>
            </label>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="w-full py-2 px-4 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 bg-primary text-white hover:bg-primary-dark focus:ring-primary"
            :class="{ 'opacity-75 cursor-not-allowed': isLoading }"
            :disabled="isLoading"
          >
            <span v-if="isLoading">
              <i class="fas fa-spinner fa-spin mr-2"></i>
              Creating account...
            </span>
            <span v-else>Create Account</span>
          </button>

          <!-- Login Link -->
          <p class="mt-4 text-center text-sm text-gray-400">
            Already have an account?
            <router-link 
              to="/login"
              class="font-medium text-primary hover:text-primary-dark"
            >
              Sign in
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
  name: '',
  phone: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false
})

const errors = reactive({
  name: '',
  phone: '',
  password: '',
  confirmPassword: ''
})

const isLoading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

function validateForm() {
  let isValid = true
  
  // Reset errors
  Object.keys(errors).forEach(key => errors[key] = '')
  
  // Validate name
  if (!form.name) {
    errors.name = 'Name is required'
    isValid = false
  } else if (form.name.length < 2) {
    errors.name = 'Name must be at least 2 characters'
    isValid = false
  }
  
  // Validate phone
  if (!form.phone) {
    errors.phone = 'Phone number is required'
    isValid = false
  } else if (!/^[0-9]{9,11}$/.test(form.phone)) {
    errors.phone = 'Please enter a valid phone number'
    isValid = false
  }
  
  // Validate password
  if (!form.password) {
    errors.password = 'Password is required'
    isValid = false
  } else if (form.password.length < 6) {
    errors.password = 'Password must be at least 6 characters'
    isValid = false
  }
  
  // Validate confirm password
  if (!form.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password'
    isValid = false
  } else if (form.confirmPassword !== form.password) {
    errors.confirmPassword = 'Passwords do not match'
    isValid = false
  }
  
  return isValid
}

async function handleSubmit() {
  if (!validateForm()) return
  
  isLoading.value = true
  
  try {
    await auth.register({
      name: form.name,
      phone: form.phone,
      password: form.password
    })
    router.push('/login')
  } catch (error) {
    if (error.response?.data?.message) {
      // Handle specific error messages from the server
      const message = error.response.data.message
      if (message.includes('phone')) {
        errors.phone = message
      } else {
        errors.password = message
      }
    } else {
      errors.password = 'An error occurred. Please try again.'
    }
  } finally {
    isLoading.value = false
  }
}

function togglePassword() {
  showPassword.value = !showPassword.value
}

function toggleConfirmPassword() {
  showConfirmPassword.value = !showConfirmPassword.value
}
</script>

<style>
/* Empty style block - using Tailwind classes directly in template */
</style>

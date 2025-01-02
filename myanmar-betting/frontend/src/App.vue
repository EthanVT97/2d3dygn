<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- Left side -->
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <router-link to="/" class="text-2xl font-bold text-blue-600 hover:text-blue-700">
                Myanmar Betting
              </router-link>
            </div>
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8" v-if="auth.isAuthenticated">
              <router-link to="/2d" class="nav-link">2D</router-link>
              <router-link to="/3d" class="nav-link">3D</router-link>
              <router-link to="/thai-lottery" class="nav-link">Thai Lottery</router-link>
              <router-link to="/football" class="nav-link">Football</router-link>
            </div>
          </div>

          <!-- Right side -->
          <div class="flex items-center">
            <template v-if="auth.isAuthenticated">
              <!-- Admin Dashboard Link -->
              <router-link v-if="auth.isAdmin" to="/admin" class="nav-link mr-4">
                Admin Dashboard
              </router-link>

              <!-- Balance -->
              <div class="mr-4">
                <span class="text-sm text-gray-600">Balance:</span>
                <span class="ml-1 text-sm font-semibold text-blue-600">
                  {{ formatAmount(auth.userBalance) }}
                </span>
              </div>

              <!-- User Menu -->
              <div class="ml-3 relative">
                <button @click="userMenuOpen = !userMenuOpen"
                  class="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <span class="sr-only">Open user menu</span>
                  <div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <span class="text-sm font-medium text-gray-700">
                      {{ auth.user?.name?.[0] || 'U' }}
                    </span>
                  </div>
                </button>

                <!-- Dropdown menu -->
                <div v-if="userMenuOpen"
                  class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div class="px-4 py-2 text-sm text-gray-700">
                    {{ auth.user?.name }}
                  </div>
                  <div class="border-t border-gray-100"></div>
                  <a href="#" @click.prevent="logout"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Sign out
                  </a>
                </div>
              </div>
            </template>

            <template v-else>
              <router-link to="/login"
                class="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                Login
              </router-link>
              <router-link to="/register"
                class="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">
                Register
              </router-link>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
import { useRouter } from 'vue-router'

export default {
  name: 'App',

  setup() {
    const auth = useAuthStore()
    const router = useRouter()
    const userMenuOpen = ref(false)

    const logout = async () => {
      await auth.logout()
      router.push('/login')
    }

    const formatAmount = (amount) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'MMK'
      }).format(amount)
    }

    onMounted(() => {
      auth.initAuth()
    })

    return {
      auth,
      userMenuOpen,
      logout,
      formatAmount
    }
  }
}
</script>

<style>
.nav-link {
  @apply inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-600 hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600 transition-colors duration-200;
}

.nav-link.router-link-active {
  @apply text-blue-600 border-blue-600;
}
</style>

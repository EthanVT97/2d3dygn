<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- Left side -->
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <router-link to="/" class="text-2xl font-bold text-gradient">
                Myanmar Betting
              </router-link>
            </div>
            <div class="hidden sm:ml-8 sm:flex sm:space-x-4" v-if="auth.isAuthenticated">
              <router-link to="/2d" class="nav-link">2D</router-link>
              <router-link to="/3d" class="nav-link">3D</router-link>
              <router-link to="/thai-lottery" class="nav-link">Thai Lottery</router-link>
              <router-link to="/football" class="nav-link">Football</router-link>
            </div>
          </div>

          <!-- Right side -->
          <div class="flex items-center space-x-4">
            <template v-if="auth.isAuthenticated">
              <!-- Admin Dashboard Link -->
              <router-link v-if="auth.isAdmin" to="/admin" class="nav-link">
                Admin Dashboard
              </router-link>

              <!-- Balance -->
              <div class="bg-gray-50 px-4 py-1.5 rounded-full shadow-sm border border-gray-200">
                <span class="text-sm text-gray-600">Balance:</span>
                <span class="ml-1.5 text-sm font-semibold text-primary">
                  {{ formatAmount(auth.userBalance) }}
                </span>
              </div>

              <!-- User Menu -->
              <div class="relative">
                <button @click="userMenuOpen = !userMenuOpen"
                  class="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary p-1.5 hover:bg-gray-50 transition-colors">
                  <span class="sr-only">Open user menu</span>
                  <div class="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shadow-sm">
                    <span class="text-sm font-medium text-primary">
                      {{ auth.user?.name?.[0] || 'U' }}
                    </span>
                  </div>
                </button>

                <!-- Dropdown menu -->
                <div v-if="userMenuOpen"
                  class="origin-top-right absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 border border-gray-100">
                  <router-link to="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    Profile
                  </router-link>
                  <router-link to="/settings" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    Settings
                  </router-link>
                  <button @click="logout" class="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                    Sign out
                  </button>
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
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--gray-600);
  border-radius: var(--radius);
  transition: all 0.2s ease;
}

.nav-link:hover {
  color: var(--primary);
  background-color: var(--gray-50);
}

.nav-link.router-link-active {
  color: var(--primary);
  background-color: var(--primary-light/10);
  font-weight: 600;
}
</style>

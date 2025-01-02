<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- Logo and Primary Nav -->
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <router-link to="/" class="text-2xl font-bold text-gradient">
                Myanmar Betting
              </router-link>
            </div>
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <router-link 
                to="/" 
                class="nav-link"
                :class="{ 'active': $route.path === '/' }"
              >
                ပင်မစာမျက်နှာ
              </router-link>
              <router-link 
                to="/betting" 
                class="nav-link"
                :class="{ 'active': $route.path.startsWith('/betting') }"
              >
                လောင်းကစား
              </router-link>
              <router-link 
                to="/history" 
                class="nav-link"
                :class="{ 'active': $route.path === '/history' }"
              >
                မှတ်တမ်း
              </router-link>
            </div>
          </div>

          <!-- Secondary Nav -->
          <div class="hidden sm:ml-6 sm:flex sm:items-center">
            <template v-if="isAuthenticated">
              <!-- User Dropdown -->
              <div class="ml-3 relative">
                <div>
                  <button 
                    type="button" 
                    class="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    @click="toggleUserMenu"
                  >
                    <span class="sr-only">Open user menu</span>
                    <div class="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
                      {{ userInitials }}
                    </div>
                  </button>
                </div>
                <div 
                  v-if="showUserMenu"
                  class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5"
                >
                  <router-link 
                    to="/profile" 
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    ပရိုဖိုင်
                  </router-link>
                  <a 
                    href="#" 
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    @click.prevent="handleLogout"
                  >
                    ထွက်မည်
                  </a>
                </div>
              </div>
            </template>
            <template v-else>
              <router-link 
                to="/login" 
                class="nav-link"
              >
                အကောင့်ဝင်ရန်
              </router-link>
              <router-link 
                to="/register" 
                class="ml-4 btn btn-primary"
              >
                အကောင့်ဖွင့်ရန်
              </router-link>
            </template>
          </div>

          <!-- Mobile menu button -->
          <div class="-mr-2 flex items-center sm:hidden">
            <button 
              type="button" 
              class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              @click="toggleMobileMenu"
            >
              <span class="sr-only">Open main menu</span>
              <svg 
                v-if="!showMobileMenu"
                class="block h-6 w-6" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg 
                v-else
                class="block h-6 w-6" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile menu -->
      <div 
        v-if="showMobileMenu"
        class="sm:hidden"
      >
        <div class="pt-2 pb-3 space-y-1">
          <router-link 
            to="/" 
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            :class="{ 'bg-gray-50': $route.path === '/' }"
          >
            ပင်မစာမျက်နှာ
          </router-link>
          <router-link 
            to="/betting" 
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            :class="{ 'bg-gray-50': $route.path.startsWith('/betting') }"
          >
            လောင်းကစား
          </router-link>
          <router-link 
            to="/history" 
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            :class="{ 'bg-gray-50': $route.path === '/history' }"
          >
            မှတ်တမ်း
          </router-link>
        </div>
        <div class="pt-4 pb-3 border-t border-gray-200">
          <template v-if="isAuthenticated">
            <div class="flex items-center px-4">
              <div class="flex-shrink-0">
                <div class="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center">
                  {{ userInitials }}
                </div>
              </div>
              <div class="ml-3">
                <div class="text-base font-medium text-gray-800">{{ userName }}</div>
                <div class="text-sm font-medium text-gray-500">{{ userPhone }}</div>
              </div>
            </div>
            <div class="mt-3 space-y-1">
              <router-link 
                to="/profile" 
                class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >
                ပရိုဖိုင်
              </router-link>
              <a 
                href="#" 
                class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                @click.prevent="handleLogout"
              >
                ထွက်မည်
              </a>
            </div>
          </template>
          <template v-else>
            <div class="space-y-1">
              <router-link 
                to="/login" 
                class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >
                အကောင့်ဝင်ရန်
              </router-link>
              <router-link 
                to="/register" 
                class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >
                အကောင့်ဖွင့်ရန်
              </router-link>
            </div>
          </template>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <router-view v-slot="{ Component }">
        <transition 
          name="fade" 
          mode="out-in"
        >
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const showMobileMenu = ref(false)
const showUserMenu = ref(false)

const isAuthenticated = computed(() => auth.isAuthenticated)
const userName = computed(() => auth.user?.name || '')
const userPhone = computed(() => auth.user?.phone || '')
const userInitials = computed(() => {
  const name = userName.value
  if (!name) return ''
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
})

function toggleMobileMenu() {
  showMobileMenu.value = !showMobileMenu.value
}

function toggleUserMenu() {
  showUserMenu.value = !showUserMenu.value
}

async function handleLogout() {
  try {
    await auth.logout()
    router.push('/login')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

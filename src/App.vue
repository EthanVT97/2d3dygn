<template>
  <div class="app-container">
    <nav class="navbar">
      <div class="container mx-auto px-4 flex justify-between items-center h-16">
        <router-link to="/" class="text-xl font-bold text-primary">
          Myanmar Betting
        </router-link>
        
        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-4">
          <router-link 
            v-for="item in navItems" 
            :key="item.path"
            :to="item.path"
            class="nav-link"
            :class="{ 'active': $route.path === item.path }"
          >
            {{ item.label }}
          </router-link>
          
          <template v-if="isAuthenticated">
            <button @click="logout" class="btn btn-secondary">
              Logout
            </button>
          </template>
          <template v-else>
            <router-link to="/login" class="btn btn-primary">
              Login
            </router-link>
          </template>
        </div>

        <!-- Mobile Menu Button -->
        <button 
          @click="toggleMobileMenu" 
          class="md:hidden p-2 rounded-lg hover:bg-surface"
        >
          <svg 
            class="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              v-if="!isMobileMenuOpen" 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M4 6h16M4 12h16M4 18h16"
            />
            <path 
              v-else 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </nav>

    <!-- Mobile Menu -->
    <div 
      v-if="isMobileMenuOpen" 
      class="md:hidden fixed inset-0 z-50 bg-background bg-opacity-95"
    >
      <div class="container mx-auto px-4 py-4 space-y-4">
        <router-link 
          v-for="item in navItems" 
          :key="item.path"
          :to="item.path"
          class="block py-2 text-lg nav-link"
          :class="{ 'active': $route.path === item.path }"
          @click="closeMobileMenu"
        >
          {{ item.label }}
        </router-link>
        
        <template v-if="isAuthenticated">
          <button 
            @click="logout" 
            class="w-full btn btn-secondary"
          >
            Logout
          </button>
        </template>
        <template v-else>
          <router-link 
            to="/login" 
            class="block w-full btn btn-primary"
            @click="closeMobileMenu"
          >
            Login
          </router-link>
        </template>
      </div>
    </div>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Footer -->
    <footer class="bg-background-secondary py-12">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 class="text-lg font-semibold mb-4">About Us</h3>
            <p class="text-text-secondary">
              Myanmar's premier online betting platform for 2D, 3D, and Thai lottery.
            </p>
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-4">Quick Links</h3>
            <ul class="space-y-2">
              <li><router-link to="/" class="text-text-secondary hover:text-primary">Home</router-link></li>
              <li><router-link to="/2d" class="text-text-secondary hover:text-primary">2D</router-link></li>
              <li><router-link to="/3d" class="text-text-secondary hover:text-primary">3D</router-link></li>
              <li><router-link to="/thai" class="text-text-secondary hover:text-primary">Thai</router-link></li>
            </ul>
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-4">Contact</h3>
            <ul class="space-y-2 text-text-secondary">
              <li>Email: support@myanmarbetting.com</li>
              <li>Phone: +95 123 456 789</li>
              <li>Available 24/7</li>
            </ul>
          </div>
        </div>
        <div class="mt-8 pt-8 border-t border-border text-center text-text-secondary">
          <p>&copy; {{ new Date().getFullYear() }} Myanmar Betting. All rights reserved.</p>
        </div>
      </div>
    </footer>
    <ApiTest v-if="showApiTest" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import ApiTest from './components/ApiTest.vue'

const router = useRouter()
const auth = useAuthStore()

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/betting', label: 'Betting' },
  { path: '/history', label: 'History' },
]

const isMobileMenuOpen = ref(false)

const isAuthenticated = computed(() => auth.isAuthenticated)

const showApiTest = ref(process.env.NODE_ENV === 'development')

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false
}

async function logout() {
  try {
    await auth.logout()
    router.push('/login')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}
</script>

<style>
.app-container {
  min-height: 100vh;
  background-color: var(--color-background);
}

.navbar {
  background-color: var(--color-surface);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 50;
}

.nav-link {
  color: var(--color-text-secondary);
  transition: color 0.2s;
}

.nav-link:hover {
  color: var(--color-primary);
}

.nav-link.active {
  color: var(--color-primary);
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-primary {
  background-color: var(--color-primary);
  color: white;
}

.btn-primary:hover {
  background-color: var(--color-primary-dark);
}

.btn-secondary {
  background-color: var(--color-surface);
  color: var(--color-text);
}

.bg-background {
  background-color: var(--color-background);
}

.bg-surface {
  background-color: var(--color-surface);
}

.text-text-secondary {
  color: var(--color-text-secondary);
}

.border-border {
  border-color: var(--color-border);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

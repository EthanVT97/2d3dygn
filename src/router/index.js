import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/football/MatchList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/betting/:id',
    name: 'MatchBetting',
    component: () => import('@/views/betting/MatchBetting.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/bets',
    name: 'BettingHistory',
    component: () => import('@/views/betting/BettingHistory.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/2d',
    name: 'TwoD',
    component: () => import('../views/TwoD.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/3d',
    name: 'ThreeD',
    component: () => import('../views/ThreeD.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/thai-lottery',
    name: 'ThaiLottery',
    component: () => import('../views/ThaiLottery.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/football',
    name: 'Football',
    component: () => import('../views/Football.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/auth/Login.vue'),
    meta: { guest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/auth/Register.vue'),
    meta: { guest: true }
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: () => import('../views/admin/Dashboard.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/forbidden',
    name: 'Forbidden',
    component: () => import('../views/errors/Forbidden.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/errors/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()
  const isAuthenticated = auth.isAuthenticated

  try {
    // Check if route requires authentication
    if (to.matched.some(record => record.meta.requiresAuth)) {
      if (!isAuthenticated) {
        // Not logged in, redirect to login
        next({
          name: 'Login',
          query: { redirect: to.fullPath }
        })
        return
      }

      // Verify token is still valid
      const isValid = await auth.checkAuth()
      if (!isValid) {
        next({
          name: 'Login',
          query: { redirect: to.fullPath }
        })
        return
      }

      // Check admin routes
      if (to.matched.some(record => record.meta.requiresAdmin)) {
        if (!auth.user?.is_admin) {
          next({ name: 'Forbidden' })
          return
        }
      }
    }

    // Check guest routes (login, register)
    if (to.matched.some(record => record.meta.guest)) {
      if (isAuthenticated) {
        next({ name: 'Home' })
        return
      }
    }

    // Proceed with navigation
    next()
  } catch (error) {
    console.error('Navigation error:', error)
    next({ name: 'Login' })
  }
})

export default router

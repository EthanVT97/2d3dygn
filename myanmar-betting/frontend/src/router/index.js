import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/football/MatchList.vue')
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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  // Check if route requires authentication
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next({ name: 'Login' })
    return
  }

  // Check if route requires admin access
  if (to.meta.requiresAdmin && !auth.isAdmin) {
    next({ name: 'Home' })
    return
  }

  // Check if route is for guests only (like login/register)
  if (to.meta.guest && auth.isAuthenticated) {
    next({ name: 'Home' })
    return
  }

  next()
})

export default router

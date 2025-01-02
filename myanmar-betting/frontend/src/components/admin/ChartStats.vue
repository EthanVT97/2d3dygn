<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <!-- Revenue Chart -->
    <div class="bg-white rounded-lg shadow p-6">
      <h3 class="text-lg font-semibold mb-4">Revenue Overview</h3>
      <div class="flex space-x-4 mb-4">
        <button 
          v-for="period in periods" 
          :key="period.days"
          @click="selectedPeriod = period.days"
          :class="[
            'px-3 py-1 rounded',
            selectedPeriod === period.days 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-100 text-gray-600'
          ]"
        >
          {{ period.label }}
        </button>
      </div>
      <canvas ref="revenueChart"></canvas>
    </div>

    <!-- User Activity Chart -->
    <div class="bg-white rounded-lg shadow p-6">
      <h3 class="text-lg font-semibold mb-4">User Activity</h3>
      <div class="flex space-x-4 mb-4">
        <button 
          v-for="period in periods" 
          :key="period.days"
          @click="selectedActivityPeriod = period.days"
          :class="[
            'px-3 py-1 rounded',
            selectedActivityPeriod === period.days 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-100 text-gray-600'
          ]"
        >
          {{ period.label }}
        </button>
      </div>
      <canvas ref="activityChart"></canvas>
    </div>

    <!-- Bet Distribution -->
    <div class="bg-white rounded-lg shadow p-6">
      <h3 class="text-lg font-semibold mb-4">Bet Distribution</h3>
      <div class="h-80">
        <Doughnut
          v-if="betDistributionData"
          :data="betDistributionData"
          :options="doughnutOptions"
        />
      </div>
    </div>

    <!-- Top Users -->
    <div class="bg-white rounded-lg shadow p-6">
      <h3 class="text-lg font-semibold mb-4">Top Users</h3>
      <div class="flex space-x-4 mb-4">
        <button 
          v-for="type in userTypes" 
          :key="type.value"
          @click="selectedUserType = type.value"
          :class="[
            'px-3 py-1 rounded-md text-sm',
            selectedUserType === type.value 
              ? 'bg-primary text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
        >
          {{ type.label }}
        </button>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr>
              <th class="px-4 py-2 text-left">User</th>
              <th class="px-4 py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in topUsers" :key="user.id">
              <td class="px-4 py-2">{{ user.name }}</td>
              <td class="px-4 py-2 text-right">
                {{ formatAmount(getUserTotal(user)) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import Chart from 'chart.js/auto'
import { Line, Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'
import axios from 'axios'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

const revenueChart = ref(null)
const activityChart = ref(null)
let revenueChartInstance = null
let activityChartInstance = null

const periods = [
  { label: '7D', days: 7 },
  { label: '30D', days: 30 },
  { label: '90D', days: 90 }
]

const userTypes = [
  { value: 'bets', label: 'Most Bets' },
  { value: 'winnings', label: 'Most Winnings' },
  { value: 'deposits', label: 'Most Deposits' }
]

const selectedPeriod = ref(7)
const selectedActivityPeriod = ref(7)
const selectedUserType = ref('bets')
const revenueData = ref(null)
const activityData = ref(null)
const betDistribution = ref(null)
const topUsers = ref([])

// Fetch data from API
const fetchRevenueData = async (days) => {
  try {
    const { data } = await axios.get(`/api/admin/stats/revenue?days=${days}`)
    revenueData.value = data
  } catch (error) {
    console.error('Error fetching revenue data:', error)
  }
}

const fetchActivityData = async (days) => {
  try {
    const { data } = await axios.get(`/api/admin/stats/activity?days=${days}`)
    activityData.value = data
  } catch (error) {
    console.error('Error fetching activity data:', error)
  }
}

const fetchBetDistribution = async () => {
  try {
    const { data } = await axios.get('/api/admin/stats')
    betDistribution.value = data.bet_distribution
  } catch (error) {
    console.error('Error fetching bet distribution:', error)
  }
}

const fetchTopUsers = async () => {
  try {
    const { data } = await axios.get(`/api/admin/top-users?type=${selectedUserType.value}`)
    topUsers.value = data
  } catch (error) {
    console.error('Error fetching top users:', error)
  }
}

// Chart data
const chartData = computed(() => {
  if (!revenueData.value) return null

  const labels = revenueData.value.map(d => new Date(d.date).toLocaleDateString())
  return {
    labels,
    datasets: [{
      label: 'Revenue',
      data: revenueData.value.map(d => d.amount),
      borderColor: 'rgb(59, 130, 246)',
      tension: 0.1
    }]
  }
})

const activityChartData = computed(() => {
  if (!activityData.value) return null

  const labels = activityData.value.map(d => new Date(d.date).toLocaleDateString())
  return {
    labels,
    datasets: [{
      label: 'Active Users',
      data: activityData.value.map(d => d.count),
      borderColor: 'rgb(16, 185, 129)',
      tension: 0.1
    }]
  }
})

const betDistributionData = computed(() => {
  if (!betDistribution.value) return null

  const labels = Object.keys(betDistribution.value)
  const data = Object.values(betDistribution.value)
  
  return {
    labels,
    datasets: [{
      data,
      backgroundColor: [
        '#10B981',
        '#3B82F6',
        '#EF4444',
        '#F59E0B',
        '#8B5CF6'
      ]
    }]
  }
})

// Create/Update charts
const createRevenueChart = () => {
  if (revenueChartInstance) {
    revenueChartInstance.destroy()
  }

  const ctx = revenueChart.value.getContext('2d')
  revenueChartInstance = new Chart(ctx, {
    type: 'line',
    data: chartData.value,
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  })
}

const createActivityChart = () => {
  if (activityChartInstance) {
    activityChartInstance.destroy()
  }

  const ctx = activityChart.value.getContext('2d')
  activityChartInstance = new Chart(ctx, {
    type: 'line',
    data: activityChartData.value,
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  })
}

// Watch for changes
watch(chartData, () => {
  if (chartData.value) {
    createRevenueChart()
  }
})

watch(activityChartData, () => {
  if (activityChartData.value) {
    createActivityChart()
  }
})

watch(selectedPeriod, (newDays) => {
  fetchRevenueData(newDays)
})

watch(selectedActivityPeriod, (newDays) => {
  fetchActivityData(newDays)
})

watch(selectedUserType, () => {
  fetchTopUsers()
})

// Utility functions
const formatAmount = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'MMK'
  }).format(amount)
}

const getUserTotal = (user) => {
  switch (selectedUserType.value) {
    case 'bets':
      return user.total_amount
    case 'winnings':
      return user.total_winnings
    case 'deposits':
      return user.total_deposits
    default:
      return 0
  }
}

// Initialize
onMounted(() => {
  fetchRevenueData(selectedPeriod.value)
  fetchActivityData(selectedActivityPeriod.value)
  fetchBetDistribution()
  fetchTopUsers()
})
</script>

<style scoped>
canvas {
  min-height: 300px;
}
</style>

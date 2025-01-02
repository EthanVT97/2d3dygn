&lt;template>
  &lt;div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <!-- Revenue Chart -->
    &lt;div class="bg-white rounded-lg shadow p-6">
      &lt;h3 class="text-lg font-semibold mb-4">Revenue Overview&lt;/h3>
      &lt;div class="flex space-x-4 mb-4">
        &lt;button 
          v-for="period in periods" 
          :key="period.days"
          @click="selectedPeriod = period.days"
          :class="[
            'px-3 py-1 rounded-md text-sm',
            selectedPeriod === period.days 
              ? 'bg-primary text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
        >
          {{ period.label }}
        &lt;/button>
      &lt;/div>
      &lt;div class="h-80">
        &lt;Line 
          v-if="chartData"
          :data="chartData"
          :options="chartOptions"
        />
      &lt;/div>
    &lt;/div>

    <!-- User Activity Chart -->
    &lt;div class="bg-white rounded-lg shadow p-6">
      &lt;h3 class="text-lg font-semibold mb-4">User Activity&lt;/h3>
      &lt;div class="flex space-x-4 mb-4">
        &lt;button 
          v-for="period in periods" 
          :key="period.days"
          @click="selectedActivityPeriod = period.days"
          :class="[
            'px-3 py-1 rounded-md text-sm',
            selectedActivityPeriod === period.days 
              ? 'bg-primary text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
        >
          {{ period.label }}
        &lt;/button>
      &lt;/div>
      &lt;div class="h-80">
        &lt;Line 
          v-if="activityChartData"
          :data="activityChartData"
          :options="activityChartOptions"
        />
      &lt;/div>
    &lt;/div>

    <!-- Bet Distribution -->
    &lt;div class="bg-white rounded-lg shadow p-6">
      &lt;h3 class="text-lg font-semibold mb-4">Bet Distribution&lt;/h3>
      &lt;div class="h-80">
        &lt;Doughnut
          v-if="betDistributionData"
          :data="betDistributionData"
          :options="doughnutOptions"
        />
      &lt;/div>
    &lt;/div>

    <!-- Top Users -->
    &lt;div class="bg-white rounded-lg shadow p-6">
      &lt;h3 class="text-lg font-semibold mb-4">Top Users&lt;/h3>
      &lt;div class="flex space-x-4 mb-4">
        &lt;button 
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
        &lt;/button>
      &lt;/div>
      &lt;div class="overflow-x-auto">
        &lt;table class="min-w-full">
          &lt;thead>
            &lt;tr>
              &lt;th class="px-4 py-2 text-left">User&lt;/th>
              &lt;th class="px-4 py-2 text-right">Total&lt;/th>
            &lt;/tr>
          &lt;/thead>
          &lt;tbody>
            &lt;tr v-for="user in topUsers" :key="user.id">
              &lt;td class="px-4 py-2">{{ user.name }}&lt;/td>
              &lt;td class="px-4 py-2 text-right">
                {{ formatAmount(getUserTotal(user)) }}
              &lt;/td>
            &lt;/tr>
          &lt;/tbody>
        &lt;/table>
      &lt;/div>
    &lt;/div>
  &lt;/div>
&lt;/template>

&lt;script setup>
import { ref, onMounted, computed } from 'vue'
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

const periods = [
  { days: 7, label: '7 Days' },
  { days: 30, label: '30 Days' },
  { days: 90, label: '90 Days' }
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

// Chart data
const chartData = computed(() => {
  if (!revenueData.value) return null

  const labels = revenueData.value.map(d => new Date(d.date).toLocaleDateString())
  return {
    labels,
    datasets: [
      {
        label: 'Deposits',
        data: revenueData.value.map(d => d.deposits),
        borderColor: '#10B981',
        backgroundColor: '#10B981',
        tension: 0.4
      },
      {
        label: 'Withdrawals',
        data: revenueData.value.map(d => d.withdrawals),
        borderColor: '#EF4444',
        backgroundColor: '#EF4444',
        tension: 0.4
      },
      {
        label: 'Net Revenue',
        data: revenueData.value.map(d => d.deposits - d.withdrawals),
        borderColor: '#3B82F6',
        backgroundColor: '#3B82F6',
        tension: 0.4
      }
    ]
  }
})

const activityChartData = computed(() => {
  if (!activityData.value) return null

  const labels = activityData.value.new_users.map(d => new Date(d.date).toLocaleDateString())
  return {
    labels,
    datasets: [
      {
        label: 'New Users',
        data: activityData.value.new_users.map(d => d.new_users),
        borderColor: '#10B981',
        backgroundColor: '#10B981',
        tension: 0.4
      },
      {
        label: 'Active Users',
        data: activityData.value.active_users.map(d => d.active_users),
        borderColor: '#3B82F6',
        backgroundColor: '#3B82F6',
        tension: 0.4
      }
    ]
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

// Chart options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top'
    }
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
}

const activityChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top'
    }
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
}

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top'
    }
  }
}

// Fetch data
const fetchRevenueData = async () => {
  try {
    const { data } = await axios.get(`/api/admin/revenue?days=${selectedPeriod.value}`)
    revenueData.value = data
  } catch (error) {
    console.error('Error fetching revenue data:', error)
  }
}

const fetchActivityData = async () => {
  try {
    const { data } = await axios.get(`/api/admin/user-activity?days=${selectedActivityPeriod.value}`)
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

// Watch for changes
watch(selectedPeriod, fetchRevenueData)
watch(selectedActivityPeriod, fetchActivityData)
watch(selectedUserType, fetchTopUsers)

// Initial fetch
onMounted(() => {
  fetchRevenueData()
  fetchActivityData()
  fetchBetDistribution()
  fetchTopUsers()
})
&lt;/script>

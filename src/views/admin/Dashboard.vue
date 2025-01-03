<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Admin Dashboard</h1>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div v-for="stat in stats" :key="stat.label" class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 text-sm">{{ stat.label }}</p>
            <p class="text-2xl font-semibold">{{ stat.value }}</p>
          </div>
          <component 
            :is="stat.icon" 
            class="h-8 w-8 text-primary"
            aria-hidden="true" 
          />
        </div>
        <div class="mt-2">
          <p class="text-sm text-gray-500">
            Today: {{ stat.today }}
          </p>
        </div>
      </div>
    </div>

    <!-- Charts and Stats -->
    <ChartStats class="mb-8" />

    <!-- Recent Winners -->
    <div class="bg-white rounded-lg shadow p-6 mb-8">
      <h2 class="text-xl font-semibold mb-4">Recent Winners</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr>
              <th class="px-4 py-2 text-left">User</th>
              <th class="px-4 py-2 text-left">Type</th>
              <th class="px-4 py-2 text-right">Amount</th>
              <th class="px-4 py-2 text-right">Payout</th>
              <th class="px-4 py-2 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="winner in recentWinners" :key="winner.id">
              <td class="px-4 py-2">{{ winner.user }}</td>
              <td class="px-4 py-2">{{ winner.type }}</td>
              <td class="px-4 py-2 text-right">{{ formatAmount(winner.amount) }}</td>
              <td class="px-4 py-2 text-right">{{ formatAmount(winner.payout) }}</td>
              <td class="px-4 py-2">{{ formatDate(winner.date) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pending Transactions -->
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">Pending Transactions</h2>
        <div class="flex space-x-2">
          <button 
            v-for="type in transactionTypes" 
            :key="type.value"
            @click="selectedType = type.value"
            :class="[
              'px-3 py-1 rounded-md text-sm',
              selectedType === type.value 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            {{ type.label }}
          </button>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr>
              <th class="px-4 py-2 text-left">User</th>
              <th class="px-4 py-2 text-left">Type</th>
              <th class="px-4 py-2 text-right">Amount</th>
              <th class="px-4 py-2 text-left">Date</th>
              <th class="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="transaction in pendingTransactions" :key="transaction.id">
              <td class="px-4 py-2">{{ transaction.user.name }}</td>
              <td class="px-4 py-2">{{ transaction.type }}</td>
              <td class="px-4 py-2 text-right">{{ formatAmount(transaction.amount) }}</td>
              <td class="px-4 py-2">{{ formatDate(transaction.created_at) }}</td>
              <td class="px-4 py-2 text-right">
                <div class="flex justify-end space-x-2">
                  <button
                    @click="approveTransaction(transaction)"
                    class="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm"
                  >
                    Approve
                  </button>
                  <button
                    @click="rejectTransaction(transaction)"
                    class="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
                  >
                    Reject
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="mt-4 flex justify-center">
        <button
          v-if="hasMoreTransactions"
          @click="loadMoreTransactions"
          class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
        >
          Load More
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { 
  UsersIcon, 
  CurrencyDollarIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon
} from '@heroicons/vue/24/outline'
import ChartStats from '@/components/admin/ChartStats.vue'
import axios from 'axios'

// Stats data
const statsData = ref(null)
const recentWinners = ref([])
const pendingTransactions = ref([])
const currentPage = ref(1)
const lastPage = ref(1)
const selectedType = ref('all')

const transactionTypes = [
  { value: 'all', label: 'All' },
  { value: 'deposit', label: 'Deposits' },
  { value: 'withdrawal', label: 'Withdrawals' }
]

// Computed properties
const stats = computed(() => {
  if (!statsData.value) return []
  
  return [
    {
      label: 'Total Users',
      value: statsData.value.total.total_users.toLocaleString(),
      today: `+${statsData.value.daily.daily_users}`,
      icon: UsersIcon
    },
    {
      label: 'Total Bets',
      value: statsData.value.total.total_bets.toLocaleString(),
      today: `+${statsData.value.daily.daily_bets}`,
      icon: ChartBarIcon
    },
    {
      label: 'Total Deposits',
      value: formatAmount(statsData.value.total.total_deposits),
      today: formatAmount(statsData.value.daily.daily_deposits),
      icon: CurrencyDollarIcon
    },
    {
      label: 'Net Revenue',
      value: formatAmount(statsData.value.total.total_deposits - statsData.value.total.total_withdrawals),
      today: formatAmount(statsData.value.daily.daily_deposits - statsData.value.daily.daily_withdrawals),
      icon: ArrowTrendingUpIcon
    }
  ]
})

const hasMoreTransactions = computed(() => {
  return currentPage.value < lastPage.value
})

// Methods
const fetchStats = async () => {
  try {
    const { data } = await axios.get('/api/admin/stats')
    statsData.value = data
    recentWinners.value = data.recent_winners
  } catch (error) {
    console.error('Error fetching stats:', error)
  }
}

const fetchTransactions = async (page = 1) => {
  try {
    const params = { page }
    if (selectedType.value !== 'all') {
      params.type = selectedType.value
    }
    
    const { data } = await axios.get('/api/admin/pending-transactions', { params })
    
    if (page === 1) {
      pendingTransactions.value = data.data
    } else {
      pendingTransactions.value = [...pendingTransactions.value, ...data.data]
    }
    
    currentPage.value = data.current_page
    lastPage.value = data.last_page
  } catch (error) {
    console.error('Error fetching transactions:', error)
  }
}

const loadMoreTransactions = () => {
  fetchTransactions(currentPage.value + 1)
}

const approveTransaction = async (transaction) => {
  try {
    await axios.post(`/api/admin/transactions/${transaction.id}/approve`)
    await fetchTransactions(1)
    await fetchStats()
  } catch (error) {
    console.error('Error approving transaction:', error)
  }
}

const rejectTransaction = async (transaction) => {
  try {
    await axios.post(`/api/admin/transactions/${transaction.id}/reject`)
    await fetchTransactions(1)
    await fetchStats()
  } catch (error) {
    console.error('Error rejecting transaction:', error)
  }
}

// Utility functions
const formatAmount = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'MMK'
  }).format(amount)
}

const formatDate = (date) => {
  return new Date(date).toLocaleString()
}

// Watch for changes
watch(selectedType, () => {
  currentPage.value = 1
  fetchTransactions(1)
})

// Initial fetch
onMounted(() => {
  fetchStats()
  fetchTransactions()
})
</script>

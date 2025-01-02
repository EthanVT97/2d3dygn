<template>
  <div class="betting-history-container">
    <div class="page-header">
      <h1>လောင်းကြေးမှတ်တမ်း</h1>
      <div class="filter-controls">
        <select v-model="filter" class="filter-select">
          <option value="all">အားလုံး</option>
          <option value="pending">စောင့်ဆိုင်းဆဲ</option>
          <option value="won">အနိုင်ရ</option>
          <option value="lost">အရှုံး</option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>မှတ်တမ်းများကို ရယူနေပါသည်...</p>
    </div>

    <div v-else-if="error" class="error-container">
      <p>{{ error }}</p>
      <button @click="loadBets" class="retry-button">
        ပြန်လည်ကြိုးစားမည်
      </button>
    </div>

    <div v-else-if="filteredBets.length === 0" class="empty-state">
      <p>လောင်းကြေးမှတ်တမ်းများ မရှိသေးပါ</p>
    </div>

    <div v-else class="bets-list">
      <div v-for="bet in filteredBets" :key="bet.id" class="bet-card">
        <div class="bet-header">
          <div class="match-teams">
            <span class="team">{{ bet.match.homeTeam.name }}</span>
            <span class="vs">VS</span>
            <span class="team">{{ bet.match.awayTeam.name }}</span>
          </div>
          <div class="bet-status" :class="bet.status">
            {{ getBetStatusText(bet.status) }}
          </div>
        </div>

        <div class="bet-details">
          <div class="bet-info">
            <div class="info-row">
              <span class="label">လောင်းကြေး:</span>
              <span class="value">{{ formatAmount(bet.amount) }} ကျပ်</span>
            </div>
            <div class="info-row">
              <span class="label">အခွင့်အရေး:</span>
              <span class="value">{{ formatOdds(bet.odds) }}</span>
            </div>
            <div class="info-row">
              <span class="label">ရရှိနိုင်သည့်ပမာဏ:</span>
              <span class="value highlight">
                {{ formatAmount(bet.amount * bet.odds) }} ကျပ်
              </span>
            </div>
          </div>

          <div class="bet-type">
            <span class="label">လောင်းထားသည့်အသင်း:</span>
            <span class="value">{{ getBetTypeText(bet.type) }}</span>
          </div>

          <div class="bet-time">
            <span class="label">လောင်းချိန်:</span>
            <span class="value">{{ formatDateTime(bet.createdAt) }}</span>
          </div>
        </div>

        <div v-if="bet.status === 'won'" class="winnings">
          <span class="label">ရရှိငွေ:</span>
          <span class="value success">{{ formatAmount(bet.winning_amount) }} ကျပ်</span>
        </div>
      </div>
    </div>

    <div v-if="filteredBets.length > 0" class="betting-summary">
      <div class="summary-card">
        <h3>အနှစ်ချုပ်</h3>
        <div class="summary-stats">
          <div class="stat">
            <span class="label">စုစုပေါင်းလောင်းကြေး:</span>
            <span class="value">{{ formatAmount(totalBets) }} ကျပ်</span>
          </div>
          <div class="stat">
            <span class="label">စုစုပေါင်းအနိုင်ရငွေ:</span>
            <span class="value success">{{ formatAmount(totalWinnings) }} ကျပ်</span>
          </div>
          <div class="stat">
            <span class="label">အသားတင်အရှုံးအမြတ်:</span>
            <span class="value" :class="netProfit >= 0 ? 'success' : 'error'">
              {{ formatAmount(netProfit) }} ကျပ်
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'

const router = useRouter()
const authStore = useAuthStore()

const bets = ref([])
const loading = ref(false)
const error = ref(null)
const filter = ref('all')

// Load bets from API
async function loadBets() {
  loading.value = true
  error.value = null
  
  try {
    const response = await axios.get('/api/football/bets', {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    
    bets.value = response.data.data
  } catch (err) {
    error.value = err.response?.data?.message || 'လောင်းကြေးမှတ်တမ်းများ ရယူ၍မရပါ'
    console.error(err)
  } finally {
    loading.value = false
  }
}

// Filter bets based on status
const filteredBets = computed(() => {
  if (filter.value === 'all') return bets.value
  return bets.value.filter(bet => bet.status === filter.value)
})

// Calculate totals
const totalBets = computed(() => {
  return filteredBets.value.reduce((sum, bet) => sum + Number(bet.amount), 0)
})

const totalWinnings = computed(() => {
  return filteredBets.value
    .filter(bet => bet.status === 'won')
    .reduce((sum, bet) => sum + Number(bet.winning_amount), 0)
})

const netProfit = computed(() => {
  return totalWinnings.value - totalBets.value
})

// Format functions
function formatAmount(amount) {
  return Number(amount).toLocaleString()
}

function formatOdds(odds) {
  return Number(odds).toFixed(2)
}

function formatDateTime(date) {
  return new Date(date).toLocaleString('my-MM', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Get display text for bet status
function getBetStatusText(status) {
  const statusMap = {
    pending: 'စောင့်ဆိုင်းဆဲ',
    won: 'အနိုင်ရ',
    lost: 'အရှုံး'
  }
  return statusMap[status] || status
}

// Get display text for bet type
function getBetTypeText(type) {
  const typeMap = {
    home: 'အိမ်ရှင်',
    away: 'ဧည့်သည်',
    draw: 'သရေ'
  }
  return typeMap[type] || type
}

// Load bets on mount
onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  loadBets()
})
</script>

<style scoped>
.betting-history-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 1.875rem;
  font-weight: 600;
  color: var(--color-text);
}

.filter-select {
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  background-color: var(--color-surface);
  color: var(--color-text);
}

.bet-card {
  background-color: var(--color-surface);
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.bet-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.match-teams {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

.vs {
  color: var(--color-text-secondary);
}

.bet-status {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.bet-status.pending {
  background-color: var(--color-warning-bg);
  color: var(--color-warning);
}

.bet-status.won {
  background-color: var(--color-success-bg);
  color: var(--color-success);
}

.bet-status.lost {
  background-color: var(--color-error-bg);
  color: var(--color-error);
}

.bet-details {
  border-top: 1px solid var(--color-border);
  padding-top: 1rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.label {
  color: var(--color-text-secondary);
}

.value {
  font-weight: 500;
}

.value.highlight {
  color: var(--color-primary);
}

.value.success {
  color: var(--color-success);
}

.value.error {
  color: var(--color-error);
}

.bet-type,
.bet-time {
  margin-top: 1rem;
  font-size: 0.875rem;
}

.winnings {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.125rem;
}

.betting-summary {
  margin-top: 2rem;
}

.summary-card {
  background-color: var(--color-surface);
  border-radius: 1rem;
  padding: 1.5rem;
}

.summary-card h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.summary-stats {
  display: grid;
  gap: 1rem;
}

.stat {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  background-color: var(--color-surface);
  border-radius: 1rem;
  color: var(--color-text-secondary);
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-container {
  text-align: center;
  padding: 2rem;
  color: var(--color-error);
}

.retry-button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: var(--color-primary);
  color: white;
  border-radius: 0.5rem;
}

@media (max-width: 768px) {
  .betting-history-container {
    padding: 1rem;
  }

  .page-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .bet-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .match-teams {
    flex-direction: column;
    align-items: flex-start;
  }

  .info-row {
    flex-direction: column;
    gap: 0.25rem;
  }
}
</style>

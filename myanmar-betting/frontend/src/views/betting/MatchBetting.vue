<template>
  <div class="betting-container">
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>ပွဲစဉ်အချက်အလက်များကို ရယူနေပါသည်...</p>
    </div>

    <div v-else-if="error" class="error-container">
      <p>{{ error }}</p>
      <button @click="loadMatch" class="retry-button">
        ပြန်လည်ကြိုးစားမည်
      </button>
    </div>

    <template v-else>
      <!-- Match Details -->
      <div class="match-details">
        <div class="match-header">
          <h2 class="match-title">လောင်းကြေးထည့်ရန်</h2>
          <div class="match-info">
            <span class="match-date">{{ formatDate(match.date) }}</span>
            <span class="match-time">{{ formatTime(match.time) }}</span>
          </div>
        </div>

        <div class="teams-container">
          <div class="team home">
            <img :src="match.home_team.logo" :alt="match.home_team.name" class="team-logo">
            <span class="team-name">{{ match.home_team.name }}</span>
            <div class="odds">{{ formatOdds(match.odds.home_win) }}</div>
          </div>
          <div class="vs-container">
            <div class="vs">VS</div>
            <div class="draw-odds">
              <span>သရေ</span>
              <div class="odds">{{ formatOdds(match.odds.draw) }}</div>
            </div>
          </div>
          <div class="team away">
            <img :src="match.away_team.logo" :alt="match.away_team.name" class="team-logo">
            <span class="team-name">{{ match.away_team.name }}</span>
            <div class="odds">{{ formatOdds(match.odds.away_win) }}</div>
          </div>
        </div>

        <!-- Betting Form -->
        <form @submit.prevent="placeBet" class="betting-form">
          <div class="form-group">
            <label for="betType">လောင်းမည့်အသင်း</label>
            <select 
              v-model="betForm.type" 
              id="betType" 
              class="form-select"
              required
            >
              <option value="home">{{ match.home_team.name }}</option>
              <option value="draw">သရေ</option>
              <option value="away">{{ match.away_team.name }}</option>
            </select>
          </div>

          <div class="form-group">
            <label for="amount">လောင်းမည့်ပမာဏ</label>
            <div class="amount-input">
              <input 
                v-model.number="betForm.amount" 
                type="number" 
                id="amount" 
                min="1000"
                step="1000"
                required
                class="form-input"
              >
              <span class="currency">ကျပ်</span>
            </div>
          </div>

          <div class="potential-winnings">
            <span>နိုင်မည့်ပမာဏ:</span>
            <span class="amount">{{ calculateWinnings }} ကျပ်</span>
          </div>

          <button 
            type="submit" 
            class="submit-button" 
            :disabled="loading || !isValidBet"
          >
            လောင်းမည်
          </button>
        </form>
      </div>

      <!-- Betting Rules -->
      <div class="betting-rules">
        <h3>စည်းမျဉ်းစည်းကမ်းများ</h3>
        <ul>
          <li>အနည်းဆုံး လောင်းကြေး - ၁၀၀၀ ကျပ်</li>
          <li>အများဆုံး လောင်းကြေး - ၁၀၀၀၀၀ ကျပ်</li>
          <li>ပွဲချိန် မတိုင်မီ ၁၀ မိနစ်အလို လောင်းကြေးများ ပိတ်မည်</li>
          <li>လောင်းကြေးထည့်ပြီးပါက ပြန်လည်ပြင်ဆင်၍မရပါ</li>
        </ul>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const match = ref(null)
const loading = ref(false)
const error = ref(null)

const betForm = ref({
  type: 'home',
  amount: 1000
})

// Load match data
async function loadMatch() {
  loading.value = true
  error.value = null
  
  try {
    const response = await axios.get(`/api/football/matches/${route.params.id}`)
    match.value = response.data
  } catch (err) {
    error.value = 'ပွဲစဉ်အချက်အလက်များ ရယူ၍မရပါ'
    console.error(err)
  } finally {
    loading.value = false
  }
}

// Format date
function formatDate(date) {
  return new Date(date).toLocaleDateString('my-MM', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Format time
function formatTime(time) {
  return new Date(time).toLocaleTimeString('my-MM', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Format odds
function formatOdds(odds) {
  return odds.toFixed(2)
}

// Calculate potential winnings
const calculateWinnings = computed(() => {
  if (!match.value || !betForm.value.amount) return 0
  
  const odds = {
    home: match.value.odds.home_win,
    draw: match.value.odds.draw,
    away: match.value.odds.away_win
  }
  
  return (betForm.value.amount * odds[betForm.value.type]).toFixed(0)
})

// Validate bet
const isValidBet = computed(() => {
  return betForm.value.amount >= 1000 && 
         betForm.value.amount <= 100000 &&
         ['home', 'draw', 'away'].includes(betForm.value.type)
})

// Place bet
async function placeBet() {
  if (!isValidBet.value) return
  
  loading.value = true
  error.value = null
  
  try {
    const response = await axios.post('/api/football/bets', {
      match_id: match.value.id,
      type: betForm.value.type,
      amount: betForm.value.amount
    }, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    
    // Show success message and redirect to bets history
    router.push('/bets')
  } catch (err) {
    error.value = err.response?.data?.message || 'လောင်းကြေးထည့်သွင်း၍မရပါ'
    console.error(err)
  } finally {
    loading.value = false
  }
}

// Load match data on mount
onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  loadMatch()
})
</script>

<style scoped>
.betting-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.match-details {
  background-color: var(--color-surface);
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.match-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.match-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text);
}

.match-info {
  display: flex;
  gap: 1rem;
  color: var(--color-text-secondary);
}

.teams-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.team {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.team-logo {
  width: 80px;
  height: 80px;
  object-fit: contain;
}

.team-name {
  font-weight: 500;
  text-align: center;
  color: var(--color-text);
}

.vs-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.vs {
  font-weight: 600;
  color: var(--color-text-secondary);
}

.draw-odds {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text-secondary);
}

.odds {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-primary);
}

.betting-form {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--color-border);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--color-text);
}

.form-select,
.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  background-color: var(--color-background);
  color: var(--color-text);
}

.amount-input {
  position: relative;
}

.currency {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-secondary);
}

.potential-winnings {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1.5rem 0;
  padding: 1rem;
  background-color: var(--color-background);
  border-radius: 0.5rem;
}

.amount {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-primary);
}

.submit-button {
  width: 100%;
  padding: 1rem;
  background-color: var(--color-primary);
  color: white;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: background-color 0.2s;
}

.submit-button:hover:not(:disabled) {
  background-color: var(--color-primary-dark);
}

.submit-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.betting-rules {
  background-color: var(--color-surface);
  border-radius: 1rem;
  padding: 2rem;
}

.betting-rules h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 1rem;
}

.betting-rules ul {
  list-style: disc;
  padding-left: 1.5rem;
  color: var(--color-text-secondary);
}

.betting-rules li {
  margin-bottom: 0.5rem;
}

@media (max-width: 768px) {
  .betting-container {
    padding: 1rem;
  }

  .match-details {
    padding: 1.5rem;
  }

  .team-logo {
    width: 60px;
    height: 60px;
  }

  .team-name {
    font-size: 0.875rem;
  }

  .odds {
    font-size: 1rem;
  }
}
</style>

<template>
  <div class="match-list-container">
    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>ပွဲစဉ်များကို ရယူနေပါသည်...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <p>{{ error }}</p>
      <button @click="fetchMatches" class="retry-button">
        ပြန်လည်ကြိုးစားမည်
      </button>
    </div>

    <!-- Content -->
    <template v-else>
      <!-- Upcoming Matches -->
      <section class="match-section">
        <h2 class="section-title">ကစားမည့်ပွဲများ</h2>
        <div v-if="upcomingMatches.length === 0" class="empty-state">
          လက်ရှိတွင် ကစားရန်ပွဲများ မရှိသေးပါ
        </div>
        <div v-else class="matches-grid">
          <div 
            v-for="match in upcomingMatches" 
            :key="match.id" 
            class="match-card upcoming"
          >
            <div class="match-header">
              <span class="match-date">{{ formatDate(match.start_time) }}</span>
              <span class="match-time">{{ formatTime(match.start_time) }}</span>
            </div>
            <div class="teams-container">
              <div class="team home">
                <img 
                  :src="match.home_team.logo" 
                  :alt="match.home_team.name" 
                  class="team-logo"
                >
                <span class="team-name">{{ match.home_team.name }}</span>
              </div>
              <div class="vs">VS</div>
              <div class="team away">
                <img 
                  :src="match.away_team.logo" 
                  :alt="match.away_team.name" 
                  class="team-logo"
                >
                <span class="team-name">{{ match.away_team.name }}</span>
              </div>
            </div>
            <div class="match-footer">
              <span class="venue">{{ match.venue }}</span>
              <button 
                v-if="match.status === 'upcoming'"
                class="bet-button" 
                @click="placeBet(match)"
              >
                လောင်းမည်
              </button>
              <span 
                v-else-if="match.status === 'live'"
                class="live-badge"
              >
                Live
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- Finished Matches -->
      <section class="match-section">
        <h2 class="section-title">ပြီးဆုံးသွားသောပွဲများ</h2>
        <div v-if="finishedMatches.length === 0" class="empty-state">
          ပြီးဆုံးသွားသောပွဲများ မရှိသေးပါ
        </div>
        <div v-else class="matches-grid">
          <div 
            v-for="match in finishedMatches" 
            :key="match.id" 
            class="match-card finished"
          >
            <div class="match-header">
              <span class="match-date">{{ formatDate(match.start_time) }}</span>
              <span class="match-status">ပြီးဆုံး</span>
            </div>
            <div class="teams-container">
              <div class="team home">
                <img 
                  :src="match.home_team.logo" 
                  :alt="match.home_team.name" 
                  class="team-logo"
                >
                <div class="team-info">
                  <span class="team-name">{{ match.home_team.name }}</span>
                  <span class="team-score">{{ match.home_score }}</span>
                </div>
              </div>
              <div class="team away">
                <img 
                  :src="match.away_team.logo" 
                  :alt="match.away_team.name" 
                  class="team-logo"
                >
                <div class="team-info">
                  <span class="team-name">{{ match.away_team.name }}</span>
                  <span class="team-score">{{ match.away_score }}</span>
                </div>
              </div>
            </div>
            <div class="match-footer">
              <span class="venue">{{ match.venue }}</span>
            </div>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const matches = ref([])
const loading = ref(false)
const error = ref(null)

// Load matches from API
async function fetchMatches() {
  loading.value = true
  error.value = null
  
  try {
    const response = await axios.get('/api/matches')
    matches.value = response.data.data
  } catch (err) {
    error.value = 'ပွဲစဉ်များ ရယူ၍မရပါ'
    console.error(err)
  } finally {
    loading.value = false
  }
}

// Filter matches by status
const upcomingMatches = computed(() => {
  return matches.value.filter(match => 
    match.status === 'upcoming' || match.status === 'live'
  )
})

const finishedMatches = computed(() => {
  return matches.value.filter(match => match.status === 'finished')
})

function formatDate(date) {
  return new Date(date).toLocaleDateString('my-MM', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function formatTime(time) {
  return new Date(time).toLocaleTimeString('my-MM', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

function placeBet(match) {
  router.push(`/betting/${match.id}`)
}

onMounted(() => {
  fetchMatches()
})
</script>

<style scoped>
.match-list-container {
  padding: 2rem;
  min-height: calc(100vh - 4rem);
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  color: var(--color-text-secondary);
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
  color: var(--color-error);
  padding: 2rem;
}

.retry-button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: var(--color-primary);
  color: white;
  border-radius: 0.5rem;
  font-weight: 500;
}

.empty-state {
  text-align: center;
  color: var(--color-text-secondary);
  padding: 2rem;
  background-color: var(--color-surface);
  border-radius: 1rem;
}

.match-section {
  margin-bottom: 3rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 1.5rem;
}

.matches-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.match-card {
  background-color: var(--color-surface);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.match-card:hover {
  transform: translateY(-2px);
}

.match-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.match-date {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
}

.match-time {
  color: var(--color-primary);
  font-weight: 500;
}

.match-status {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
}

.teams-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 1.5rem 0;
}

.team {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
}

.team-logo {
  width: 64px;
  height: 64px;
  object-fit: contain;
}

.team-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.team-name {
  color: var(--color-text);
  font-weight: 500;
  text-align: center;
}

.team-score {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-primary);
}

.vs {
  color: var(--color-text-secondary);
  font-weight: 600;
  margin: 0 1rem;
}

.match-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
}

.venue {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
}

.bet-button {
  background-color: var(--color-primary);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: background-color 0.2s;
}

.bet-button:hover {
  background-color: var(--color-primary-dark);
}

.live-badge {
  background-color: var(--color-error);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .match-list-container {
    padding: 1rem;
  }

  .matches-grid {
    grid-template-columns: 1fr;
  }

  .team-logo {
    width: 48px;
    height: 48px;
  }

  .team-name {
    font-size: 0.875rem;
  }
}
</style>

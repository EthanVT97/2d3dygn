<template>
  <div class="py-8">
    <h1 class="text-3xl font-bold mb-8">ဘောလုံးလောင်းကစား</h1>

    <!-- Live Matches -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 class="text-2xl font-bold mb-6">Live ပွဲများ</h2>
      
      <div class="space-y-4">
        <div v-for="match in liveMatches" :key="match.id" class="border rounded-lg p-4">
          <div class="flex justify-between items-center">
            <div class="text-lg font-semibold">{{ match.league }}</div>
            <div class="text-sm text-gray-500">{{ match.time }}'</div>
          </div>
          
          <div class="flex justify-between items-center mt-4">
            <div class="text-center flex-1">
              <div class="font-medium">{{ match.homeTeam }}</div>
              <div class="text-2xl font-bold">{{ match.homeScore }}</div>
            </div>
            <div class="text-xl font-bold mx-4">VS</div>
            <div class="text-center flex-1">
              <div class="font-medium">{{ match.awayTeam }}</div>
              <div class="text-2xl font-bold">{{ match.awayScore }}</div>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-4 mt-4">
            <button 
              class="p-2 text-center rounded border hover:bg-gray-50"
              :class="{'bg-primary text-white': match.selectedBet === 'home'}"
              @click="selectBet(match.id, 'home')"
            >
              {{ match.homeOdds }}
            </button>
            <button 
              class="p-2 text-center rounded border hover:bg-gray-50"
              :class="{'bg-primary text-white': match.selectedBet === 'draw'}"
              @click="selectBet(match.id, 'draw')"
            >
              {{ match.drawOdds }}
            </button>
            <button 
              class="p-2 text-center rounded border hover:bg-gray-50"
              :class="{'bg-primary text-white': match.selectedBet === 'away'}"
              @click="selectBet(match.id, 'away')"
            >
              {{ match.awayOdds }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Upcoming Matches -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 class="text-2xl font-bold mb-6">မနက်ဖြန်ပွဲများ</h2>
      
      <div class="space-y-4">
        <div v-for="match in upcomingMatches" :key="match.id" class="border rounded-lg p-4">
          <div class="flex justify-between items-center">
            <div class="text-lg font-semibold">{{ match.league }}</div>
            <div class="text-sm text-gray-500">{{ match.time }}</div>
          </div>
          
          <div class="flex justify-between items-center mt-4">
            <div class="text-center flex-1">
              <div class="font-medium">{{ match.homeTeam }}</div>
            </div>
            <div class="text-xl font-bold mx-4">VS</div>
            <div class="text-center flex-1">
              <div class="font-medium">{{ match.awayTeam }}</div>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-4 mt-4">
            <button 
              class="p-2 text-center rounded border hover:bg-gray-50"
              :class="{'bg-primary text-white': match.selectedBet === 'home'}"
              @click="selectBet(match.id, 'home')"
            >
              {{ match.homeOdds }}
            </button>
            <button 
              class="p-2 text-center rounded border hover:bg-gray-50"
              :class="{'bg-primary text-white': match.selectedBet === 'draw'}"
              @click="selectBet(match.id, 'draw')"
            >
              {{ match.drawOdds }}
            </button>
            <button 
              class="p-2 text-center rounded border hover:bg-gray-50"
              :class="{'bg-primary text-white': match.selectedBet === 'away'}"
              @click="selectBet(match.id, 'away')"
            >
              {{ match.awayOdds }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Bet Slip -->
    <div class="bg-white rounded-lg shadow-md p-6" v-if="selectedBets.length > 0">
      <h2 class="text-2xl font-bold mb-6">လောင်းထားသောပွဲများ</h2>
      
      <div class="space-y-4">
        <div v-for="bet in selectedBets" :key="bet.id" class="border rounded-lg p-4">
          <div class="flex justify-between items-center">
            <div>
              <div class="font-medium">{{ bet.match }}</div>
              <div class="text-sm text-gray-500">{{ bet.type }}</div>
            </div>
            <div class="text-lg font-bold">{{ bet.odds }}</div>
          </div>
        </div>

        <!-- Bet Amount Input -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">လောင်းကြေး</label>
          <input 
            type="number" 
            v-model="betAmount" 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            min="1000"
            step="1000"
          >
        </div>

        <!-- Potential Winnings -->
        <div class="bg-gray-50 p-4 rounded-md">
          <div class="flex justify-between items-center">
            <span class="text-gray-700">နိုင်မည့်ငွေပမာဏ</span>
            <span class="text-xl font-bold text-primary">{{ potentialWinnings }} ကျပ်</span>
          </div>
        </div>

        <button 
          @click="placeBet"
          class="w-full bg-primary text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700"
        >
          လောင်းမည်
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Reactive state
const liveMatches = ref([
  {
    id: 1,
    league: 'Premier League',
    homeTeam: 'Manchester United',
    awayTeam: 'Liverpool',
    homeScore: 2,
    awayScore: 1,
    time: '75',
    homeOdds: '2.10',
    drawOdds: '3.50',
    awayOdds: '2.80',
    selectedBet: null
  },
  {
    id: 2,
    league: 'La Liga',
    homeTeam: 'Barcelona',
    awayTeam: 'Real Madrid',
    homeScore: 0,
    awayScore: 0,
    time: '32',
    homeOdds: '2.50',
    drawOdds: '3.20',
    awayOdds: '2.60',
    selectedBet: null
  }
])

const upcomingMatches = ref([
  {
    id: 3,
    league: 'Premier League',
    homeTeam: 'Arsenal',
    awayTeam: 'Chelsea',
    time: '2024-01-03 20:00',
    homeOdds: '1.90',
    drawOdds: '3.40',
    awayOdds: '3.20',
    selectedBet: null
  },
  {
    id: 4,
    league: 'Bundesliga',
    homeTeam: 'Bayern Munich',
    awayTeam: 'Dortmund',
    time: '2024-01-03 21:30',
    homeOdds: '1.70',
    drawOdds: '3.80',
    awayOdds: '3.50',
    selectedBet: null
  }
])

const betAmount = ref(1000)
const selectedBets = ref([])

// Select bet function
const selectBet = (matchId, type) => {
  const match = [...liveMatches.value, ...upcomingMatches.value].find(m => m.id === matchId)
  if (match) {
    match.selectedBet = type
    
    // Update selected bets
    const existingBetIndex = selectedBets.value.findIndex(b => b.id === matchId)
    const betInfo = {
      id: matchId,
      match: `${match.homeTeam} vs ${match.awayTeam}`,
      type: type === 'home' ? match.homeTeam : type === 'away' ? match.awayTeam : 'Draw',
      odds: type === 'home' ? match.homeOdds : type === 'away' ? match.awayOdds : match.drawOdds
    }
    
    if (existingBetIndex > -1) {
      selectedBets.value[existingBetIndex] = betInfo
    } else {
      selectedBets.value.push(betInfo)
    }
  }
}

// Computed potential winnings
const potentialWinnings = computed(() => {
  if (selectedBets.value.length === 0 || !betAmount.value) return 0
  
  const totalOdds = selectedBets.value.reduce((acc, bet) => acc * parseFloat(bet.odds), 1)
  return Math.round(betAmount.value * totalOdds)
})

// Place bet function
const placeBet = () => {
  // TODO: Implement bet placement logic
  console.log({
    bets: selectedBets.value,
    amount: betAmount.value,
    potentialWinnings: potentialWinnings.value
  })
}
</script>

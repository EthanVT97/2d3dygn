import { defineStore } from 'pinia'

export const useFootballStore = defineStore('football', {
  state: () => ({
    upcomingMatches: [],
    finishedMatches: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchMatches() {
      this.loading = true
      this.error = null
      
      try {
        // Replace with actual API endpoint
        const response = await fetch('/api/matches')
        const data = await response.json()
        
        this.upcomingMatches = data.upcoming
        this.finishedMatches = data.finished
      } catch (error) {
        this.error = 'Failed to load matches'
        console.error('Error fetching matches:', error)
      } finally {
        this.loading = false
      }
    },

    async placeBet(matchId, betData) {
      try {
        const response = await fetch(`/api/matches/${matchId}/bet`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(betData)
        })
        
        if (!response.ok) {
          throw new Error('Failed to place bet')
        }
        
        return await response.json()
      } catch (error) {
        console.error('Error placing bet:', error)
        throw error
      }
    }
  }
})

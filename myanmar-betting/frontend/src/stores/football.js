import { defineStore } from 'pinia'
import { api } from './auth'

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
        const response = await api.get('/api/matches')
        
        if (!response.data) {
          throw new Error('No data received from server')
        }
        
        this.upcomingMatches = response.data.upcoming || []
        this.finishedMatches = response.data.finished || []
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to load matches'
        console.error('Error fetching matches:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async placeBet(matchId, betData) {
      try {
        const response = await api.post(`/api/matches/${matchId}/bet`, betData)
        
        if (!response.ok) {
          throw new Error(response.data?.message || 'Failed to place bet')
        }
        
        return response.data
      } catch (error) {
        console.error('Error placing bet:', error)
        throw error
      }
    }
  }
})

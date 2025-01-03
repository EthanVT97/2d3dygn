export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://myanmar-betting-api.onrender.com'

export const api = {
  matches: `${API_BASE_URL}/api/matches`,
  bet: (matchId) => `${API_BASE_URL}/api/matches/${matchId}/bet`
}

<template>
  <div class="fixed bottom-4 right-4 p-4 rounded-lg shadow-lg bg-gray-800 text-white max-w-md">
    <h3 class="text-lg font-semibold mb-2">API Connection Status</h3>
    
    <div class="space-y-2">
      <!-- API Status -->
      <div class="flex items-center justify-between">
        <span>API Server:</span>
        <span 
          :class="{
            'text-green-400': apiStatus === 'connected',
            'text-red-400': apiStatus === 'error',
            'text-yellow-400': apiStatus === 'checking'
          }"
        >
          {{ apiStatusText }}
        </span>
      </div>

      <!-- Last Response -->
      <div v-if="lastResponse" class="text-sm bg-gray-700 p-2 rounded">
        <pre class="whitespace-pre-wrap">{{ JSON.stringify(lastResponse, null, 2) }}</pre>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="text-sm text-red-400 bg-red-900 bg-opacity-50 p-2 rounded">
        {{ error }}
      </div>

      <!-- Test Button -->
      <button
        @click="testConnection"
        class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
        :disabled="loading"
      >
        <span v-if="loading">Testing...</span>
        <span v-else>Test Connection</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const apiStatus = ref('checking')
const lastResponse = ref(null)
const error = ref(null)
const loading = ref(false)

const apiStatusText = computed(() => {
  switch (apiStatus.value) {
    case 'connected':
      return 'Connected'
    case 'error':
      return 'Error'
    case 'checking':
      return 'Checking...'
    default:
      return 'Unknown'
  }
})

async function testConnection() {
  loading.value = true
  error.value = null
  lastResponse.value = null
  apiStatus.value = 'checking'

  try {
    // Test basic endpoint
    const response = await axios.get('/api/health-check')
    lastResponse.value = response.data
    apiStatus.value = 'connected'
  } catch (err) {
    error.value = err.response?.data?.message || err.message
    apiStatus.value = 'error'
    lastResponse.value = {
      status: err.response?.status,
      data: err.response?.data
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  testConnection()
})
</script>

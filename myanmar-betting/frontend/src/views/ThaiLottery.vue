<template>
  <div class="py-8">
    <h1 class="text-3xl font-bold mb-8">ထိုင်းလော့ထရီ</h1>

    <!-- Next Draw Information -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-8">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 class="text-xl font-semibold mb-4">နောက်ထီဖွင့်ရက်</h2>
          <div class="text-2xl font-bold text-primary">
            {{ nextDrawDate }}
          </div>
        </div>
        <div>
          <h2 class="text-xl font-semibold mb-4">ကျန်ရှိချိန်</h2>
          <div class="text-4xl font-bold text-primary">
            {{ countdown }}
          </div>
        </div>
      </div>
    </div>

    <!-- Betting Form -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 class="text-2xl font-bold mb-6">ထိုင်းလော့ထရီ ဝယ်ယူရန်</h2>
      
      <form @submit.prevent="submitBet" class="space-y-6">
        <!-- Number Input -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">လော့ထရီနံပါတ်</label>
          <input 
            type="text" 
            v-model="ticketNumber" 
            maxlength="6" 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            placeholder="000000-999999"
          >
        </div>

        <!-- Prize Category Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">ဆုအမျိုးအစား</label>
          <div class="space-y-2">
            <label class="inline-flex items-center">
              <input 
                type="checkbox" 
                v-model="selectedPrizes" 
                value="first" 
                class="form-checkbox text-primary"
              >
              <span class="ml-2">ပထမဆု (6,000,000 ဘတ်)</span>
            </label>
            <label class="inline-flex items-center">
              <input 
                type="checkbox" 
                v-model="selectedPrizes" 
                value="last_three" 
                class="form-checkbox text-primary"
              >
              <span class="ml-2">နောက်ဆုံး ၃ လုံး (4,000 ဘတ်)</span>
            </label>
            <label class="inline-flex items-center">
              <input 
                type="checkbox" 
                v-model="selectedPrizes" 
                value="last_two" 
                class="form-checkbox text-primary"
              >
              <span class="ml-2">နောက်ဆုံး ၂ လုံး (2,000 ဘတ်)</span>
            </label>
          </div>
        </div>

        <!-- Quantity Input -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">အရေအတွက်</label>
          <input 
            type="number" 
            v-model="quantity" 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            min="1"
            step="1"
          >
        </div>

        <!-- Total Amount Display -->
        <div class="bg-gray-50 p-4 rounded-md">
          <div class="flex justify-between items-center">
            <span class="text-gray-700">စုစုပေါင်းငွေ</span>
            <span class="text-xl font-bold text-primary">{{ totalAmount }} ကျပ်</span>
          </div>
        </div>

        <button 
          type="submit" 
          class="w-full bg-primary text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700"
        >
          ဝယ်ယူမည်
        </button>
      </form>
    </div>

    <!-- Latest Results -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-bold mb-6">နောက်ဆုံးထွက်ဂဏန်းများ</h2>
      
      <!-- First Prize -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold mb-4">ပထမဆု</h3>
        <div class="text-4xl font-bold text-primary text-center">
          {{ latestResults.firstPrize }}
        </div>
      </div>

      <!-- Other Prizes -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 class="text-lg font-semibold mb-4">နောက်ဆုံး ၃ လုံး</h3>
          <div class="grid grid-cols-2 gap-4">
            <div v-for="number in latestResults.lastThree" :key="number" class="text-2xl font-bold text-center bg-gray-50 p-4 rounded">
              {{ number }}
            </div>
          </div>
        </div>
        <div>
          <h3 class="text-lg font-semibold mb-4">နောက်ဆုံး ၂ လုံး</h3>
          <div class="text-2xl font-bold text-center bg-gray-50 p-4 rounded">
            {{ latestResults.lastTwo }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Reactive state
const ticketNumber = ref('')
const selectedPrizes = ref([])
const quantity = ref(1)
const nextDrawDate = ref('2024-01-16')
const countdown = ref('13:23:45:12')

// Sample latest results
const latestResults = ref({
  firstPrize: '123456',
  lastThree: ['789', '456'],
  lastTwo: '45'
})

// Computed total amount (80 baht per ticket)
const totalAmount = computed(() => {
  return quantity.value * 80 * 40 // 80 baht * 40 MMK/baht exchange rate
})

// Submit bet function
const submitBet = () => {
  // TODO: Implement ticket purchase logic
  console.log({
    number: ticketNumber.value,
    prizes: selectedPrizes.value,
    quantity: quantity.value,
    total: totalAmount.value
  })
}
</script>

<template>
  <div class="py-8">
    <h1 class="text-3xl font-bold mb-8">2D ထီ</h1>

    <!-- Live Timer and Results -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-8">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 class="text-xl font-semibold mb-4">မနက်ပိုင်း ထီပိတ်ချိန်</h2>
          <div class="text-4xl font-bold text-primary">
            {{ morningTimer }}
          </div>
        </div>
        <div>
          <h2 class="text-xl font-semibold mb-4">ညနေပိုင်း ထီပိတ်ချိန်</h2>
          <div class="text-4xl font-bold text-primary">
            {{ eveningTimer }}
          </div>
        </div>
      </div>
    </div>

    <!-- Betting Form -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 class="text-2xl font-bold mb-6">ထီထိုးရန်</h2>
      
      <form @submit.prevent="submitBet" class="space-y-6">
        <!-- Time Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">အချိန်ရွေးချယ်ရန်</label>
          <div class="flex space-x-4">
            <label class="inline-flex items-center">
              <input 
                type="radio" 
                v-model="betTime" 
                value="morning" 
                class="form-radio text-primary"
              >
              <span class="ml-2">မနက်ပိုင်း</span>
            </label>
            <label class="inline-flex items-center">
              <input 
                type="radio" 
                v-model="betTime" 
                value="evening" 
                class="form-radio text-primary"
              >
              <span class="ml-2">ညနေပိုင်း</span>
            </label>
          </div>
        </div>

        <!-- Number Input -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">ထီဂဏန်း</label>
          <input 
            type="text" 
            v-model="betNumber" 
            maxlength="2" 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            placeholder="00-99"
          >
        </div>

        <!-- Amount Input -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">ငွေပမာဏ</label>
          <input 
            type="number" 
            v-model="betAmount" 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            min="100"
            step="100"
          >
        </div>

        <button 
          type="submit" 
          class="w-full bg-primary text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700"
        >
          ထီထိုးမည်
        </button>
      </form>
    </div>

    <!-- Previous Results -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-bold mb-6">ယခင်ထွက်ဂဏန်းများ</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ရက်စွဲ</th>
              <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">အချိန်</th>
              <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ထွက်ဂဏန်း</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="result in previousResults" :key="result.id">
              <td class="px-6 py-4 whitespace-nowrap">{{ result.date }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ result.time }}</td>
              <td class="px-6 py-4 whitespace-nowrap font-bold">{{ result.number }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Reactive state
const betTime = ref('morning')
const betNumber = ref('')
const betAmount = ref(100)
const morningTimer = ref('11:30:00')
const eveningTimer = ref('16:30:00')

// Sample data for previous results
const previousResults = ref([
  { id: 1, date: '2024-01-02', time: 'မနက်ပိုင်း', number: '45' },
  { id: 2, date: '2024-01-02', time: 'ညနေပိုင်း', number: '78' },
  { id: 3, date: '2024-01-01', time: 'မနက်ပိုင်း', number: '23' },
  { id: 4, date: '2024-01-01', time: 'ညနေပိုင်း', number: '91' },
])

// Submit bet function
const submitBet = () => {
  // TODO: Implement bet submission logic
  console.log({
    time: betTime.value,
    number: betNumber.value,
    amount: betAmount.value
  })
}
</script>

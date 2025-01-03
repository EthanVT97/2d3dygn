<template>
  <div class="py-8">
    <h1 class="text-3xl font-bold mb-8">3D ထီ</h1>

    <!-- Live Timer and Next Draw -->
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
      <h2 class="text-2xl font-bold mb-6">3D ထီထိုးရန်</h2>
      
      <form @submit.prevent="submitBet" class="space-y-6">
        <!-- Number Input -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">ထီဂဏန်း</label>
          <input 
            type="text" 
            v-model="betNumber" 
            maxlength="3" 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            placeholder="000-999"
          >
        </div>

        <!-- Bet Type Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">လောင်းကစားအမျိုးအစား</label>
          <select 
            v-model="betType"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          >
            <option value="straight">တိုက်ရိုက်</option>
            <option value="rumble">ရမ်ဘယ်</option>
            <option value="box">ဘော့စ်</option>
          </select>
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
              <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ထွက်ဂဏန်း</th>
              <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ဆုကြေးငွေ</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="result in previousResults" :key="result.id">
              <td class="px-6 py-4 whitespace-nowrap">{{ result.date }}</td>
              <td class="px-6 py-4 whitespace-nowrap font-bold">{{ result.number }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ result.prize }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Reactive state
const betNumber = ref('')
const betType = ref('straight')
const betAmount = ref(100)
const nextDrawDate = ref('2024-01-15')
const countdown = ref('12:23:45:12')

// Sample data for previous results
const previousResults = ref([
  { id: 1, date: '2024-01-01', number: '234', prize: '500,000 ကျပ်' },
  { id: 2, date: '2023-12-15', number: '567', prize: '500,000 ကျပ်' },
  { id: 3, date: '2023-12-01', number: '789', prize: '500,000 ကျပ်' },
])

// Computed total amount based on bet type
const totalAmount = computed(() => {
  let multiplier = 1
  if (betType.value === 'rumble') {
    multiplier = 6
  } else if (betType.value === 'box') {
    multiplier = 3
  }
  return betAmount.value * multiplier
})

// Submit bet function
const submitBet = () => {
  // TODO: Implement bet submission logic
  console.log({
    number: betNumber.value,
    type: betType.value,
    amount: betAmount.value,
    total: totalAmount.value
  })
}
</script>

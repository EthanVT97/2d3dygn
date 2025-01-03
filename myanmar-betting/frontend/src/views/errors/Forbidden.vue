<template>
  <div class="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-6 py-12">
    <div class="text-center">
      <h1 class="text-9xl font-bold text-gray-900">403</h1>
      <h2 class="mt-4 text-3xl font-semibold text-gray-900">ခွင့်ပြုချက်မရှိပါ</h2>
      <p class="mt-2 text-lg text-gray-600">ဤစာမျက်နှာကို ကြည့်ရှုခွင့်မရှိပါ</p>
      <div class="mt-6">
        <router-link
          to="/"
          class="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          ပင်မစာမျက်နှာသို့ ပြန်သွားမည်
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  // Automatically redirect to home after 5 seconds
  setTimeout(() => {
    router.push('/')
  }, 5000)
})
</script>

<template>
  <div class="py-8">
    <!-- Hero Section -->
    <div class="bg-primary text-white rounded-lg p-8 mb-8">
      <h1 class="text-4xl font-bold mb-4">မြန်မာ့ ထီနှင့် လောင်းကစားဝက်ဘ်ဆိုက်မှ ကြိုဆိုပါသည်</h1>
      <p class="text-lg mb-6">2D, 3D, ထိုင်းလော့ထရီနှင့် ဘောလုံးပွဲများကို တစ်နေရာတည်းတွင် လောင်းနိုင်ပါပြီ</p>
      <router-link 
        to="/register" 
        class="bg-white text-primary px-6 py-3 rounded-md font-medium hover:bg-gray-100"
      >
        ယခုပင် စတင်ရန်
      </router-link>
    </div>

    <!-- Features Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-xl font-bold mb-4">2D</h3>
        <p class="text-gray-600 mb-4">နေ့စဉ် မနက်ပိုင်း/ညနေပိုင်း 2D ထီဂဏန်းများ</p>
        <router-link 
          to="/2d" 
          class="text-primary hover:text-blue-700"
        >
          ပိုမိုလေ့လာရန် →
        </router-link>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-xl font-bold mb-4">3D</h3>
        <p class="text-gray-600 mb-4">လစဉ် 3D ထီဂဏန်းများနှင့် ဆုကြေးငွေများ</p>
        <router-link 
          to="/3d" 
          class="text-primary hover:text-blue-700"
        >
          ပိုမိုလေ့လာရန် →
        </router-link>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-xl font-bold mb-4">ထိုင်းလော့ထရီ</h3>
        <p class="text-gray-600 mb-4">နှစ်ပတ်တစ်ကြိမ် ထိုင်းနိုင်ငံ၏ တရားဝင်ထီဂဏန်းများ</p>
        <router-link 
          to="/thai-lottery" 
          class="text-primary hover:text-blue-700"
        >
          ပိုမိုလေ့လာရန် →
        </router-link>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-xl font-bold mb-4">ဘောလုံး</h3>
        <p class="text-gray-600 mb-4">နိုင်ငံတကာ ဘောလုံးပွဲများအတွက် လောင်းကစားမှုများ</p>
        <router-link 
          to="/football" 
          class="text-primary hover:text-blue-700"
        >
          ပိုမိုလေ့လာရန် →
        </router-link>
      </div>
    </div>

    <!-- Live Results Section -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-bold mb-6">နောက်ဆုံးရ ထီဂဏန်းများ</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 class="text-lg font-semibold mb-4">2D ထီဂဏန်းများ</h3>
          <div class="space-y-2">
            <p>မနက်ပိုင်း: <span class="font-bold">45</span></p>
            <p>ညနေပိုင်း: <span class="font-bold">78</span></p>
          </div>
        </div>
        <div>
          <h3 class="text-lg font-semibold mb-4">3D ထီဂဏန်း</h3>
          <p>နောက်ဆုံးထွက်: <span class="font-bold">234</span></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Component logic here
</script>

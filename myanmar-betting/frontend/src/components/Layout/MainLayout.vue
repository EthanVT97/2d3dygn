<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Navigation Bar -->
    <nav class="bg-primary text-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between h-16">
          <div class="flex">
            <!-- Logo -->
            <div class="flex-shrink-0 flex items-center">
              <h1 class="text-xl font-bold">MM Betting</h1>
            </div>
            
            <!-- Navigation Links -->
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <router-link 
                to="/" 
                class="inline-flex items-center px-1 pt-1 text-sm font-medium"
                active-class="border-b-2 border-white"
              >
                မူလစာမျက်နှာ
              </router-link>
              <router-link 
                to="/2d" 
                class="inline-flex items-center px-1 pt-1 text-sm font-medium"
                active-class="border-b-2 border-white"
              >
                2D
              </router-link>
              <router-link 
                to="/3d" 
                class="inline-flex items-center px-1 pt-1 text-sm font-medium"
                active-class="border-b-2 border-white"
              >
                3D
              </router-link>
              <router-link 
                to="/thai-lottery" 
                class="inline-flex items-center px-1 pt-1 text-sm font-medium"
                active-class="border-b-2 border-white"
              >
                ထိုင်းလော့ထရီ
              </router-link>
              <router-link 
                to="/football" 
                class="inline-flex items-center px-1 pt-1 text-sm font-medium"
                active-class="border-b-2 border-white"
              >
                ဘောလုံး
              </router-link>
            </div>
          </div>
          
          <!-- Right Side Navigation -->
          <div class="flex items-center">
            <router-link 
              to="/login" 
              class="text-sm font-medium px-4 py-2 rounded-md hover:bg-blue-700"
            >
              အကောင့်ဝင်ရန်
            </router-link>
            <router-link 
              to="/register" 
              class="ml-4 text-sm font-medium px-4 py-2 bg-white text-primary rounded-md hover:bg-gray-100"
            >
              အကောင့်ဖွင့်ရန်
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <slot></slot>
    </main>

    <!-- Footer -->
    <footer class="bg-primary text-white">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 class="text-lg font-bold mb-4">ဆက်သွယ်ရန်</h3>
            <p>ဖုန်း: 09-XXXXXXXXX</p>
            <p>အီးမေးလ်: info@mmbetting.com</p>
          </div>
          <div>
            <h3 class="text-lg font-bold mb-4">အကူအညီ</h3>
            <ul>
              <li><a href="#" class="hover:text-gray-300">မေးခွန်းများ</a></li>
              <li><a href="#" class="hover:text-gray-300">စည်းမျဉ်းစည်းကမ်းများ</a></li>
              <li><a href="#" class="hover:text-gray-300">လုံခြုံရေးမူဝါဒ</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-lg font-bold mb-4">နောက်ဆုံးရသတင်းများ</h3>
            <p>နောက်ဆုံးရ ကံစမ်းမဲများနှင့် ပရိုမိုးရှင်းများအတွက် စာရင်းသွင်းပါ</p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
// Component logic here
</script>

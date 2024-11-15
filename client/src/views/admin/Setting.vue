<template>
  <div :class="darkMode ? 'dark' : ''" class="settings-container min-h-screen flex items-center justify-center transition-all duration-500">
    <div class="bg-white dark:bg-gradient-to-r dark:from-gray-700 dark:to-gray-900 p-8 rounded-2xl shadow-2xl transition-all duration-500 max-w-lg w-full">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-3xl font-bold text-gray-800 dark:text-white">Settings</h2>
        <button @click="toggleDarkMode" class="focus:outline-none">
          <div class="relative w-14 h-8 bg-gray-400 dark:bg-blue-600 rounded-full shadow-inner transition-colors duration-500 ease-in-out">
            <div :class="darkMode ? 'translate-x-6' : 'translate-x-0'" class="absolute top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow transition-transform duration-500 ease-in-out flex items-center justify-center">
              <i :class="darkMode ? 'fas fa-moon text-blue-500' : 'fas fa-sun text-yellow-400'"></i>
            </div>
          </div>
        </button>
      </div>
      <div class="mt-8">
        <p class="text-lg text-gray-700 dark:text-gray-300">
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// Khởi tạo trạng thái darkMode
const darkMode = ref(false);

// Khi component mount, kiểm tra localStorage
onMounted(() => {
  if (localStorage.getItem('darkMode') === 'true') {
    darkMode.value = true;
    document.documentElement.classList.add('dark');
  }
});

// Hàm chuyển đổi dark mode
const toggleDarkMode = () => {
  darkMode.value = !darkMode.value;
  localStorage.setItem('darkMode', darkMode.value);
  if (darkMode.value) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};
</script>

<style scoped>
.settings-container {
  transition: background-color 0.5s ease, color 0.5s ease;
}

/* Thiết lập chế độ tối */
.dark .settings-container {
  background-color: #1f2937; /* Xám tối */
  color: #f9fafb; /* Màu trắng nhạt */
}

/* Hiệu ứng chuyển đổi smooth */
.bg-white {
  transition: background-color 0.5s ease;
}

/* Toggle button - cải tiến với gradient và shadow */
.bg-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.dark\:bg-gradient {
  background: linear-gradient(135deg, #2b5876 0%, #4e4376 100%);
}

/* Tooltip CSS */
.tooltip {
  position: relative;
  display: inline-block;
}

.tooltip .tooltiptext {
  visibility: hidden;
  width: 140px;
  background-color: #555;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px;
  position: absolute;
  z-index: 1;
  bottom: 125%; /* Vị trí tooltip phía trên */
  left: 50%;
  margin-left: -75px; /* Đảm bảo tooltip căn giữa */
  opacity: 0;
  transition: opacity 0.3s;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
  opacity: 1;
}
</style>

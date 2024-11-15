<template>
  <div>
    <!-- Thanh điều hướng chính -->
    <nav
      :class="['menu', isScrollingDown ? 'menu-hidden' : 'menu-visible']"
      class="bg-black shadow-lg fixed top-0 z-50 w-full transition-transform duration-500 py-4 border-b border-gray-700"
    >
      <div class="container mx-auto flex justify-between items-center px-6">
        <div class="text-3xl font-bold text-white italic hover:text-gray-400 transition duration-300 cursor-pointer">
          SimpleFashion
        </div>
        <div class="hidden md:flex gap-6 text-gray-400 font-medium">
          <div class="hover:text-white cursor-pointer transition duration-200 transform hover:scale-105" @click="nextHome">
            TRANG CHỦ
          </div>
          <div class="hover:text-white cursor-pointer transition duration-200 transform hover:scale-105">DANH MỤC</div>
          <div class="hover:text-white cursor-pointer transition duration-200 transform hover:scale-105">DỊCH VỤ</div>
          <div class="hover:text-white cursor-pointer transition duration-200 transform hover:scale-105">BLOG</div>
          <div class="hover:text-white cursor-pointer transition duration-200 transform hover:scale-105">MEGA MENU</div>
          <div class="hover:text-white cursor-pointer transition duration-200 transform hover:scale-105">CỬA HÀNG</div>
          <div class="hover:text-white cursor-pointer transition duration-200 transform hover:scale-105">TRANG</div>
        </div>
        <div class="flex items-center space-x-6">
          <div
            class="relative text-2xl text-gray-400 cursor-pointer hover:text-white transition duration-300 transform hover:scale-110"
            @click="nextCart"
          >
            <i class="fa-solid fa-cart-shopping"></i>
            <div
              v-if="userLocal && userCartLength"
              class="absolute text-xs text-white bg-red-500 rounded-full w-5 h-5 flex items-center justify-center -top-2 -right-2 shadow-md"
            >
              {{ userCartLength }}
            </div>
          </div>

          <!-- Kiểm tra userLocal và menu người dùng -->
          <div class="relative">
            <div
              v-if="userLocal"
              class="flex items-center gap-2 cursor-pointer hover:bg-gray-800 px-2 py-1 rounded transition duration-200"
              @mouseenter="handleMouseEnter"
              @mouseleave="handleMouseLeave"
            >
              <img
                class="w-8 h-8 rounded-full border border-gray-600 shadow-md"
                :src="userAvatar"
                alt="Avatar"
              />
              <span class="text-gray-400 font-medium">{{ userName }}</span>
            </div>
            <a class="cursor-pointer text-blue-400 hover:underline transition" v-else @click="handleLogin">Đăng nhập?</a>

            <!-- Menu hiển thị khi hover -->
            <div
              v-if="showMenu"
              class="absolute right-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-lg py-2 z-30 border border-gray-700"
              @mouseenter="handleMouseEnter"
              @mouseleave="handleMouseLeave"
            >
              <p class="px-4 py-2 hover:bg-gray-800 cursor-pointer transition text-gray-400 hover:text-white" @click="handleProfile">
                Tài khoản của tôi
              </p>
              <p class="px-4 py-2 hover:bg-gray-800 cursor-pointer transition text-gray-400 hover:text-white" @click="handleMyOrder">
                Đơn mua
              </p>
              <p class="px-4 py-2 hover:bg-gray-800 cursor-pointer transition text-gray-400 hover:text-white" @click="handleMyLike">
                Yêu thích
              </p>
              <p class="px-4 py-2 text-red-500 hover:bg-red-700 cursor-pointer transition hover:text-white" @click="handleLogout">
                Đăng xuất
              </p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const store = useStore();
const router = useRouter();
const showMenu = ref(false);
let timeoutId;

const userLocal = JSON.parse(localStorage.getItem("userLogin") || "null");
const listCustomer = computed(() => store.state.customer?.data || []);
const lastScrollTop = ref(0);
const isScrollingDown = ref(false);

const handleScroll = () => {
  const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
  isScrollingDown.value = currentScroll > lastScrollTop.value;
  lastScrollTop.value = currentScroll <= 0 ? 0 : currentScroll;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
  store.dispatch("apiGetCustomer");
});

const handleMouseEnter = () => {
  if (timeoutId) clearTimeout(timeoutId);
  showMenu.value = true;
};

const handleMouseLeave = () => {
  timeoutId = setTimeout(() => {
    showMenu.value = false;
  }, 300);
};

const handleLogin = () => {
  router.push("/login");
};

const handleProfile = () => {
  router.push("/profile");
};

const handleMyOrder = () => {
  router.push("/myOrder");
};

const handleMyLike = () => {
  router.push("/myLike");
};

const handleLogout = () => {
  localStorage.removeItem("userLogin");
  router.push("/login");
};

const nextHome = () => {
  router.push("/");
};

const nextCart = () => {
  userLocal ? router.push("/cart") : router.push("/login");
};

// Computed properties to safely access user data
const user = computed(() => listCustomer.value.find((cus) => cus.id === userLocal?.id));
const userCartLength = computed(() => user.value?.cart?.length || 0);
const userAvatar = computed(() => user.value?.avatar || 'https://via.placeholder.com/150');
const userName = computed(() => user.value?.name || 'Người dùng');
</script>

<style>
.menu {
  transition: transform 0.5s ease, opacity 0.5s ease;
}

.menu-hidden {
  transform: translateY(-100%);
  opacity: 0;
}

.menu-visible {
  transform: translateY(0);
  opacity: 1;
}

.shadow-md {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}
</style>

<template>
  <menu class="w-52 bg-zinc-900 text-white min-h-screen p-4 shadow-md">
    <h2 class="text-2xl font-semibold mb-8 text-gray-100 text-center">Admin</h2>
    <nav>
      <ul class="space-y-4">
        <li>
          <router-link
            class="flex items-center px-3 py-2 rounded-lg hover:bg-gray-800 transition duration-200 hover:text-yellow-400"
            to="/admin/dashboard"
            exact-active-class="active"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3v18h18V3H3z" />
            </svg>
            <span class="flex-grow text-sm">Dashboard</span>
          </router-link>
        </li>
        <li>
          <router-link
            class="flex items-center px-3 py-2 rounded-lg hover:bg-gray-800 transition duration-200 hover:text-yellow-400"
            to="/admin/category"
            exact-active-class="active"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V7a2 2 0 00-2-2H6a2 2 0 00-2 2v6m16 0v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4m16 0H4" />
            </svg>
            <span class="flex-grow text-sm">Category</span>
          </router-link>
        </li>
        <li>
          <router-link
            class="flex items-center px-3 py-2 rounded-lg hover:bg-gray-800 transition duration-200 hover:text-yellow-400"
            to="/admin/customer"
            exact-active-class="active"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7h18M3 11h18M3 15h18" />
            </svg>
            <span class="flex-grow text-sm">Customer</span>
          </router-link>
        </li>
        <li>
          <router-link
            class="flex items-center px-3 py-2 rounded-lg hover:bg-gray-800 transition duration-200 hover:text-yellow-400"
            to="/admin/products"
            exact-active-class="active"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V5a2 2 0 00-2-2H6a2 2 0 00-2 2v6m16 0v8m0 0a2 2 0 01-2 2H6a2 2 0 01-2-2v-8m16 0H4" />
            </svg>
            <span class="flex-grow text-sm">Products</span>
          </router-link>
        </li>
        <li>
          <router-link
            class="flex items-center px-3 py-2 rounded-lg hover:bg-gray-800 transition duration-200 hover:text-yellow-400"
            to="/admin/orders"
            exact-active-class="active"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16m-7 4h7" />
            </svg>
            <span class="flex-grow text-sm">Orders</span>
          </router-link>
        </li>
        <li>
          <router-link
            class="flex items-center px-3 py-2 rounded-lg hover:bg-gray-800 transition duration-200 hover:text-yellow-400"
            to="/admin/setting"
            exact-active-class="active"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 1v3m0 16v3M4.22 4.22l2.12 2.12M15.66 15.66l2.12 2.12M1 12h3m16 0h3M4.22 19.78l2.12-2.12M15.66 8.34l2.12-2.12" />
            </svg>
            <span class="flex-grow text-sm">Settings</span>
          </router-link>
        </li>
        <li class="mt-10">
          <button
            @click="logOut"
            class="flex items-center text-red-400 hover:text-red-600 px-3 py-2 rounded-lg hover:bg-gray-800 transition duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span class="flex-grow text-sm">Log out</span>
          </button>
        </li>
      </ul>
    </nav>
  </menu>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const logOut = () => {
  localStorage.removeItem('userLogin');
  router.push('/login');
};
</script>

<style scoped>
.active {
  color: #fbbf24; /* Màu chữ vàng khi mục được chọn */
  font-weight: bold;
}
</style>

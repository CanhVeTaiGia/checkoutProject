<template>
  <div>
    <Header />
    <div class="flex justify-center text-center pt-28 text-3xl font-bold">
      Sản phẩm yêu thích của bạn
    </div>

    <!-- Hiển thị danh sách sản phẩm yêu thích -->
    <div v-for="product in user?.like" :key="product.id" class="flex justify-center items-center mt-12 mb-5">
      <div class="w-4/5 bg-white shadow-md border border-gray-300 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 ease-in-out">
        <div class="flex justify-between items-center mb-4">
          <div>
            <span class="text-xl font-semibold">
              {{ product.name.split(' ').slice(0, 5).join(' ') }}
            </span>
          </div>
          <div class="text-red-500 text-lg">
            {{ formatVND(product.price) }}
          </div>
        </div>
        <div class="flex justify-between items-center mb-4">
          <img :src="product.image" alt={product.name} class="w-[100px] h-[100px] object-cover mr-5 border border-gray-300 rounded-md" />
          <div class="flex-grow">
            <p class="text-gray-600 w-2/3 text-sm">
              {{ product.description.split(' ').slice(0, 20).join(' ') }}...
            </p>
          </div>
        </div>
        <div class="flex justify-end items-center mt-5 gap-3">
          <button @click="deleteLike(product)" class="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-400 transition">
            Xóa
          </button>
          <button class="bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-400 transition">
            Liên hệ người bán
          </button>
          <button @click="nextCard(product.id)" class="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-400 transition">
            Xem chi tiết sản phẩm
          </button>
        </div>
      </div>
    </div>

    <div v-if="user?.like.length == 0" class="flex justify-center items-center mt-20 mb-20 text-red-500 text-xl">
      Bạn chưa có bất kỳ sản phẩm yêu thích nào, hãy thêm ở phần trang chủ!
    </div>

    <Contact />
    <Footer />
    <Delete v-if="showMenu" @deleteConfirm="handleDeleteConfirm" @close="handleClose"></Delete>
  </div>
</template>

<script setup>
import Footer from '@/components/Footer.vue';
import Header from '@/components/Header.vue';
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '@/api/instance';
import { useStore } from 'vuex';
import Delete from '@/components/Delete.vue';

const store = useStore();
const router = useRouter();
const users = ref([]);
const user = ref(null);
const showMenu = ref(false);
const userLocal = JSON.parse(localStorage.getItem('userLogin') || 'null');

// Hàm lấy dữ liệu người dùng từ API
const fetchData = async () => {
  try {
    const response = await apiClient.get('users');
    users.value = response.data;
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu người dùng:', error);
  }
};

watch(users, (newUsers) => {
  if (newUsers.length > 0) {
    user.value = newUsers.find(item => item.id === userLocal.id);
    if (!user.value.like) {
      user.value.like = [];
    }
  }
});

onMounted(() => {
  fetchData();
});

// format tiền
const formatVND = (price) => {
  if (price) {
    return price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  }
};

const nextCard = (id) => {
  router.push(`/card/${id}`);
};

const IdDelete = ref(null);
const deleteLike = (item) => {
  showMenu.value = true;
  IdDelete.value = item.id;
};

const nextHome = () => {
  router.push('/');
};

const handleClose = () => {
  showMenu.value = false;
};

const handleDeleteConfirm = () => {
  if (user.value.like.some(i => i.id === IdDelete.value)) {
    user.value.like = user.value.like.filter(item => item.id !== IdDelete.value);
    store.dispatch('apiEditCustomer', user.value);
    showMenu.value = false;
  }
};
</script>

<style>
/* Tailwind CSS được sử dụng trực tiếp trong template */
</style>

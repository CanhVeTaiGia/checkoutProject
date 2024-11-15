<template>
  <div>
    <Header />
    <div class="flex justify-center text-center pt-28 text-3xl font-bold">
      Đơn hàng đã mua
    </div>

    <!-- Kiểm tra nếu người dùng có đơn hàng -->
    <div v-for="order in orders.filter(item => item.idUser == user.id).reverse()" :key="order.id" class="flex justify-center items-center mt-12 mb-5">
      <div class="w-4/5 bg-gray-100 border border-gray-300 rounded-lg p-6 shadow-lg">
        <div class="flex justify-between items-center mb-4">
          <div>
            <span class="text-xl font-bold">Mã đơn hàng:
               </span>{{ order.id }}
          </div>
          <div :class="order.status === 'choDuyet' ? 'text-red-500' : order.status === 'daDuyet' ? 'text-yellow-500' : 'text-green-500'">
            {{ order.status === 'choDuyet' ? 'Đang chờ duyệt' : order.status === 'daDuyet' ? 'Đã duyệt' : 'Đã giao thành công' }}
          </div>
        </div>

        <!-- Hiển thị từng sản phẩm trong đơn hàng -->
        <div v-for="item in order.cart" :key="item.id" @click="nextCard(item.id)" class="flex justify-between items-center mb-4 hover:text-red-500 cursor-pointer">
          <img :src="item.image" class="w-[100px] h-[100px] object-cover mr-5 border border-gray-300 rounded-md" />
          <div class="flex-grow">
            <p class="text-lg font-semibold mb-1">{{ item.name.split(' ').slice(0, 5).join(' ') }}</p>
            <p class="text-gray-600">Số lượng: <span class="text-black font-bold">{{ item.quantity }}</span></p>
          </div>
          <div class="text-right">
            <span class="text-gray-800 text-lg">{{ formatVND(item.price) }}</span>
          </div>
        </div>

        <!-- Tổng tiền và phí ship -->
        <div class="flex justify-between items-center border-t border-gray-300 pt-5 mt-5">
          <div class="flex gap-2">
            <span class="font-bold">Phí ship:</span>
            <span class="text-gray-800">{{ formatVND(order.ship) }}</span>
          </div>
        </div>

        <div class="flex gap-2">
          <span class="font-bold">Mã Giảm giá:</span>
          <span class="text-gray-800">{{ order.sale }}</span>
        </div>

        <div class="flex justify-between mt-4">
          <div class="flex gap-2">
            <span class="font-bold text-red-500 text-lg">Tổng tiền:</span>
            <span class="text-red-500 text-lg">{{ formatVND(calculateTotal(order) + order.ship) }}</span>
          </div>
          <button class="bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-400 transition">Liên Hệ Người Bán</button>
        </div>
      </div>
    </div>

    <!-- Nếu không có đơn hàng -->
    <div v-if="orders.filter(item => item.idUser == user.id).length == 0" class="text-center mt-20 text-red-500 text-xl">
      Bạn chưa có đơn đặt hàng nào
    </div>

    <Contact />
    <Footer />
  </div>
</template>

<script setup>
import Footer from '@/components/Footer.vue';
import Header from '@/components/Header.vue';
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '@/api/instance';

const router = useRouter();
const users = ref([]);
const orders = ref([]);
const sales = ref([]);
const user = ref(null);
const showMenu = ref(false);
const userLocal = JSON.parse(localStorage.getItem('userLogin') || 'null');

// Hàm lấy dữ liệu người dùng từ API
const fetchData = async () => {
  try {
    const response = await apiClient.get('users');
    const responseOrders = await apiClient.get('orders');
    const response2 = await apiClient.get('sales');
    users.value = response.data;
    orders.value = responseOrders.data;
    sales.value = response2.data;
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu người dùng:', error);
  }
};

watch(users, (newUsers) => {
  if (newUsers.length > 0) {
    user.value = newUsers.find(item => item.id === userLocal.id);
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

// Tính tổng tiền của một đơn hàng
const calculateTotal = (order) => {
  let total = 0;

  if (order.cart) {
    order.cart.forEach(item => {
      total += item.price * item.quantity;
    });
  }

  if (order.sale) {
    const sale = sales.value.find(sale => sale.name === order.sale && sale.status);
    if (sale) {
      total -= (total * sale.down) / 100;
    }
  }

  return total; // Không cộng phí ship tại đây nữa
};


const nextHome = () => {
  router.push('/');
};

const nextCard = (id) => {
  router.push(`/card/${id}`);
};
</script>

<style>
/* Tailwind CSS styles are applied directly in the template */
</style>

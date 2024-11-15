<template>
  <div>
    <Header></Header>
    <!-- cart -->
    <div class="shopping-cart p-5 font-sans border-gray-200 mb-4 bg-gray-100 rounded-lg shadow-md">
      <div class="shopping-cart__header mt-16 text-center mb-5">
        <h2 class="shopping-cart__header-h2 inline-block relative text-3xl font-bold pb-2 text-gray-800">
          Giỏ hàng của bạn
          <span class="absolute bottom-[-5px] left-1/2 transform -translate-x-1/2 w-16 h-[2px] bg-pink-500"></span>
        </h2>
      </div>
      <div class="shopping-cart-child flex flex-col lg:flex-row justify-center gap-6">
        <div v-if="user?.cart.length !== 0" class="shopping-cart__items mt-5 w-full lg:w-[650px] p-6 bg-white rounded-lg shadow-lg">
          <div class="shopping-cart__items-p bg-gray-100 flex gap-1 py-4 px-5 -mt-2 mb-4 rounded-md">
            <p class="text-lg text-gray-700">
              Bạn đang có <b>{{ user?.cart.length }} sản phẩm</b> trong giỏ hàng
            </p>
          </div>
          <div v-for="item in user?.cart" :key="item.id" class="mb-4">
            <div class="item py-4 flex justify-between items-center border-b border-gray-200 pb-4">
              <div class="item-card flex items-center gap-4">
                <img class="shopping-cart__item-img w-20 h-20 rounded-md shadow-sm" :src='item.image' alt="Product Image" />
                <div class="shopping-cart__details flex flex-col items-start text-left">
                  <b class="shopping-cart__name font-serif text-gray-800">{{ wordProduct(item.name) }}</b>
                  <div class="counter mt-2 mb-2 flex gap-2 items-center">
                    <button @click="downQuantity(item)" :disabled="item.quantity == 1" class="w-8 h-8 bg-gray-200 rounded-md flex items-center justify-center hover:bg-gray-300 transition">
                      -
                    </button>
                    <input type="text" class="w-10 h-8 text-center border border-gray-300 rounded-md" v-model="item.quantity" @input="handleQuantityChange(item)" />
                    <button @click="upQuantity(item)" class="w-8 h-8 bg-gray-200 rounded-md flex items-center justify-center hover:bg-gray-300 transition">
                      +
                    </button>
                  </div>
                  <div v-if="errorStock" class="text-red-500 text-xs">Số lượng sản phẩm trong kho không đủ</div>
                  <b class="text-gray-700">{{ formatVND(item.price) }}</b>
                </div>
              </div>
              <i @click="handleDelete(item)" class="fa-solid fa-trash icon-delete text-xl text-gray-500 cursor-pointer hover:text-red-500 transition"></i>
            </div>
            <div class="shopping-cart__price flex justify-between items-center mt-2">
              <b class="text-gray-600">Thành tiền:</b>
              <b class="shopping-cart__price-number text-red-600">{{ formatVND(item.price * item.quantity) }}</b>
            </div>
          </div>
          <div class="shopping-cart__notes mt-5">
            <textarea class="w-full h-24 p-2 border border-gray-300 rounded-md" placeholder="Ghi chú đơn hàng"></textarea>
          </div>

          <button @click="handleShowDeleteAll" class="shopping-cart__clear-all w-full lg:w-2/5 rounded py-2 bg-red-500 text-white mt-5 hover:bg-red-600 transition">
            Xóa tất cả sản phẩm trong giỏ
          </button>
        </div>
        <div v-else class="shopping-cart-zero flex justify-center mt-12 text-lg text-gray-700 w-full lg:w-[44%] bg-white p-6 rounded-md shadow-md">
          Giỏ hàng của bạn đang trống
        </div>
        <div class="shopping-cart__summary mt-5 border border-gray-300 w-full lg:w-[20%] bg-white p-4 rounded-lg shadow-lg">
          <b class="shopping-cart__summary-b border-b border-gray-300 pb-4 block text-gray-800">
            Thông tin đơn hàng
          </b>
          <div class="shopping-cart__summary__child flex justify-between items-center border-b border-gray-300 pb-2 mt-4 mb-2">
            <b class="text-gray-600">Tổng tiền: </b>
            <div class="shopping-cart__summary__child2 text-2xl text-red-600">{{ user?.cart?.length ? formatVND(calculateTotalPrice()) : '0 VND' }}</div>
          </div>
          <div class="shopping-cart__summary-t text-gray-500 text-xs mb-2">
            Bạn có thể nhập mã giảm giá ở trang thanh toán
          </div>

          <button v-if="user?.cart.length !== 0" @click="handlePay" class="shopping-cart__checkout w-full py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition">
            Thanh toán
          </button>
          <div v-else class="text-center text-red-600 font-bold mt-4">
            Bạn không có sản phẩm nào!
          </div>
        </div>
      </div>
    </div>

    <!-- Modal xóa sản phẩm -->
    <Delete v-if="showDelete" @deleteConfirm="handleDeleteConfirm" @close="handleClose"></Delete>

    <!-- Modal xóa tất cả sản phẩm -->
    <Delete2 v-if="showDeleteAll" @closeAll="handleCloseAll" @deleteAllConfirm="handleDeleteAllConfirm"></Delete2>

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
import { useStore } from 'vuex';
import Delete from '@/components/Delete.vue';
import Delete2 from '@/components/Delete2.vue';

const errorStock = ref(false);
const store = useStore();
const router = useRouter();
const users = ref([]);
const products = ref([]);
const userLocal = JSON.parse(localStorage.getItem('userLogin') || 'null');
const showDelete = ref(false);
const showDeleteAll = ref(false);
const user = ref(null);
const idDelete = ref(null);

// Điều hướng nếu chưa đăng nhập
if (!userLocal) {
  router.push('/login');
}

// Hàm lấy dữ liệu người dùng từ API
const fetchData = async () => {
  try {
    const response = await apiClient.get('users');
    const response2 = await apiClient.get('products');
    users.value = response.data;
    products.value = response2.data;
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu người dùng:', error);
  }
};

// Gọi API khi component được mounted
onMounted(() => {
  fetchData();
  window.scroll(0, 0);
});

// Đồng bộ dữ liệu user
watch(users, (newUsers) => {
  if (newUsers.length > 0) {
    user.value = newUsers.find(item => item.id === userLocal.id); 
  }
});

// Điều hướng về trang chủ
const nextHome = () => {
  router.push('/');
};

// Chuyển hướng đến trang thanh toán
const handlePay = () => {
  router.push('/pay');
};

// Tính tổng tiền giỏ hàng
const calculateTotalPrice = () => {
  if (user.value && user.value.cart) {
    return user.value.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
  return 0;
};

// Format tiền VND
const formatVND = (price) => {
  if (!price || isNaN(price)) {
    return "0 VND";
  }
  return price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
};

// Tách chuỗi sản phẩm để hiển thị tối đa 4 từ
const wordProduct = (name) => {
  const words = name.split(' ');
  return words.slice(0, 4).join(' ');
};

// Hiển thị modal xóa tất cả sản phẩm
const handleShowDeleteAll = () => {
  showDeleteAll.value = true;
};

// Xác nhận xóa tất cả sản phẩm trong giỏ hàng
const handleDeleteAllConfirm = () => {
  user.value = { ...user.value, cart: [] };
  store.dispatch('apiEditCustomer', user.value);
  showDeleteAll.value = false;
};

// Hiển thị modal xóa sản phẩm
const handleDelete = (product) => {
  idDelete.value = product.id;
  showDelete.value = true;
};

// Xác nhận xóa sản phẩm
const handleDeleteConfirm = () => {
  const newCart = user.value?.cart.filter(item => item.id !== idDelete.value);
  user.value = { ...user.value, cart: newCart };
  store.dispatch('apiEditCustomer', user.value);
  showDelete.value = false;
};

// Đóng modal xóa sản phẩm
const handleClose = () => {
  showDelete.value = false;
};

// Đóng modal xóa tất cả sản phẩm
const handleCloseAll = () => {
  showDeleteAll.value = false;
};

// Tăng số lượng sản phẩm
const upQuantity = (product) => {
  const productFind = products.value.find(item => item.id === product.id);
  const indexProduct = user.value?.cart.findIndex(item => item.id === product.id);
  if (indexProduct !== -1) {
    const currentQuantity = user.value.cart[indexProduct].quantity;
    if (currentQuantity < productFind.stock) {
      user.value.cart[indexProduct].quantity++;
      store.dispatch('apiEditCustomer', user.value);
      errorStock.value = false;
    } else {
      errorStock.value = true;
      setTimeout(() => {
        errorStock.value = false;
      }, 3000);
    }
  }
};

// Giảm số lượng sản phẩm
const downQuantity = (product) => {
  errorStock.value = false;
  const indexProduct = user.value?.cart.findIndex(item => item.id === product.id);
  if (indexProduct !== -1 && user.value.cart[indexProduct].quantity > 1) {
    user.value.cart[indexProduct].quantity--;
    store.dispatch('apiEditCustomer', user.value);
  }
};

// Xử lý thay đổi số lượng từ input
const handleQuantityChange = (product) => {
  const indexProduct = user.value?.cart.findIndex(item => item.id === product.id);
  const productFind = products.value.find(item => item.id === product.id);

  if (indexProduct !== -1) {
    const currentQuantity = user.value.cart[indexProduct].quantity;
    let newQuantity = parseInt(user.value.cart[indexProduct].quantity, 10);

    if (isNaN(newQuantity) || newQuantity < 1) {
      newQuantity = 1;
    }

    if (newQuantity <= productFind.stock) {
      user.value.cart[indexProduct].quantity = newQuantity;
      store.dispatch('apiEditCustomer', user.value);
      errorStock.value = false;
    } else {
      errorStock.value = true;
      setTimeout(() => {
        errorStock.value = false;
      }, 3000);
      user.value.cart[indexProduct].quantity = currentQuantity;
    }
  }
};
</script>

<style scoped>
.shopping-cart__header-h2 {
  color: #1f2937; /* Đổi màu tiêu đề */
}

.icon-delete:hover {
  transform: scale(1.1); /* Tăng kích thước icon khi hover */
}

input[type="text"] {
  outline: none;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
}
</style>

<template>
  <div>
    <Header />
    <!-- Chi tiết sản phẩm -->
    <div class="flex justify-center items-center mt-28">
      <div class="w-3/4 flex p-20 border border-gray-200 rounded-lg bg-white shadow-lg">
        <div class="w-1/2">
          <img class="w-full h-full rounded-lg shadow-md transition-transform transform hover:scale-105" :src="product?.image" alt="Product Image" />
        </div>
        <div class="w-1/2 flex flex-col justify-between ml-10">
          <h1 class="text-3xl font-semibold  text-gray-800">{{ product?.name }}</h1>
          <div class="flex items-center ">
            <span class="mr-2 text-xl text-yellow-500">{{ calculateAverageRating() }}</span>
            <div class="flex text-yellow-500">
              <span v-for="index in 5" :key="index" class="mr-1">★</span>
            </div>
            <span class="ml-4 text-gray-500">Chính hãng</span>
          </div>
          <div class="flex gap-3 items-center ">
            <span class="text-lg">Giá sản phẩm:</span>
            <span class="text-2xl text-red-500 font-bold">{{ formatVND(product?.price) }}</span>
          </div>
          <div class="text-sm text-gray-600 mb-4">
            <b>Chi tiết sản phẩm:</b> {{ product?.description }}
          </div>
          <div class="flex space-x-3">
            <button @click="handleAddToCart" class="flex items-center gap-2 px-3 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-transform transform hover:scale-105">
              Thêm Vào Giỏ Hàng
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Sản phẩm liên quan -->
    <div class="container mx-auto my-10 px-10">
      <h2 class="text-lg font-bold mb-4">Sản phẩm liên quan</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div
          v-for="item in someCat(products.filter(i => i.category == product?.category && i.id !== product.id)).slice(0, 4)"
          :key="item.id"
          @click="nextCard(item.id)"
          class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-transform transform hover:scale-105 cursor-pointer"
        >
          <img class="w-full h-35 object-cover" :src="item.image" alt="Product Image" />
          <div class="p-4">
            <h3 class="text-sm font-semibold truncate">{{ item.name }}</h3>
            <p class="text-red-500 mt-2 font-bold">{{ formatVND(item.price) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Bình luận -->
    <div class="container mx-auto my-10 px-10">
      <h2 class="text-lg font-bold mb-4">Bình luận & Đánh giá</h2>
      <div class="flex items-center space-x-4 mb-4">
        <button class="border border-red-500 px-4 py-2 rounded-full text-red-500">Đã mua hàng</button>
        <button class="border border-red-500 px-4 py-2 rounded-full text-red-500">Hỏi đáp</button>
        <button class="border border-red-500 px-4 py-2 rounded-full text-red-500">5 sao</button>
      </div>

      <div v-for="review in reviews" :key="review.id" class="border-b border-gray-300 py-4">
        <div class="flex items-center space-x-4 mb-2">
          <div class="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">{{ review.name[0].toUpperCase() }}</div>
          <div>
            <p class="font-bold">{{ review.name }}</p>
            <div class="flex items-center text-gray-500">
              <svg class="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v10m8-10v10M4 21h16c1.104 0 2-.896 2-2V5c0-1.104-.896-2-2-2H4C2.896 3 2 3.896 2 5v14c0 1.104.896 2 2 2z" />
              </svg>
              <span>{{ review.created_at }}</span>
            </div>
          </div>
        </div>
        <div class="flex items-center mb-2">
          <span class="text-yellow-500 text-sm">★★★★★</span>
        </div>
        <p class="text-gray-600">{{ review.comment }}</p>
      </div>
    </div>

    <!-- Modal thông báo thành công -->
    <transition name="fade">
      <div v-if="isShowMessager" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div class="bg-white p-6 rounded-lg shadow-lg text-center transform transition-transform duration-300 scale-100">
          <h2 class="text-2xl font-bold mb-2 text-green-500">Thành công!</h2>
          <p class="text-gray-700">Sản phẩm đã được thêm vào giỏ hàng.</p>
        </div>
      </div>
    </transition>

    <Contact />
    <Footer />
  </div>
</template>

<script setup>
import apiClient from "@/api/instance";
import Footer from "@/components/Footer.vue";
import Header from "@/components/Header.vue";
import { ref, onMounted, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

const store = useStore();
const route = useRoute();
const router = useRouter();
const id = computed(() => route.params.id);

const products = ref([]);
const product = ref(null);

// Lấy thông tin sản phẩm và dữ liệu khác từ API
const fetchData = async () => {
  try {
    const response = await apiClient.get("products");
    products.value = response.data;
  } catch (error) {
    console.error(error);
  }
};

// Theo dõi sự thay đổi của id sản phẩm và cập nhật product
watch(id, () => {
  fetchData();
});

// Theo dõi danh sách sản phẩm và cập nhật chi tiết sản phẩm
watch(products, (newProducts) => {
  if (newProducts.length > 0) {
    product.value = newProducts.find((item) => item.id == id.value);
  }
});

onMounted(() => {
  window.scrollTo(0, 0);
  fetchData();
});

// format tiền
const formatVND = (price) => {
  if (price) {
    return price.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  }
};

// Hàm lấy sản phẩm ngẫu nhiên trong cùng danh mục
const someCat = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// Chuyển đến trang chi tiết của sản phẩm khác
const nextCard = async (id) => {
  await router.push(`/card/${id}`);
  window.scrollTo(0, 0);
};

// Thêm sản phẩm vào giỏ hàng và kiểm tra đăng nhập
const isShowMessager = ref(false);
const handleAddToCart = async () => {
  isShowMessager.value = true;

  const userLocal = JSON.parse(localStorage.getItem("userLogin"));
  if (userLocal == 'null' || !userLocal) {
    router.push('/login');
    return;
  }
  try {
    const response = await apiClient.get("users");
    const users = response.data;
    const indexUser = users.findIndex((item) => item.id === userLocal.id);

    if (indexUser === -1) {
      console.log("Không tìm thấy người dùng");
      return;
    }

    const user = users[indexUser];
    const productInCart = user.cart.findIndex((item) => item.id === product.value.id);

    // Thêm sản phẩm vào giỏ hàng hoặc tăng số lượng
    if (productInCart !== -1) {
      user.cart[productInCart].quantity += 1;
    } else {
      user.cart.push({ ...product.value, quantity: 1 });
    }

    // Cập nhật lại giỏ hàng
    await store.dispatch("apiEditCustomer", user);
    fetchData();

    // Đóng modal tự động sau 1 giây
    setTimeout(() => {
      isShowMessager.value = false;
    }, 1000);
  } catch (error) {
    console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
  }
};

// Tính toán số sao trung bình từ đánh giá
const reviews = ref([
  { id: 1, name: "Nguyen Van A", rating: 5, comment: "Sản phẩm tuyệt vời", created_at: "2024-10-30" },
  { id: 2, name: "Le Thi B", rating: 4, comment: "Rất tốt", created_at: "2024-10-29" }
]);

const calculateAverageRating = () => {
  const totalRating = reviews.value.reduce((total, review) => total + review.rating, 0);
  return (totalRating / reviews.value.length).toFixed(1);
};
</script>

<style scoped>
button {
  transition: background-color 0.3s ease, transform 0.3s ease;
}

button:hover {
  background-color: #2c5282;
  transform: scale(1.05);
}

/* Thêm bóng cho sản phẩm liên quan */
.bg-white:hover {
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
}

/* Modal style */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

.fixed {
  animation: fadeIn 0.3s ease-in-out;
}
</style>

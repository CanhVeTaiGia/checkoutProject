<template>
  <div>
    <Header></Header>
    <Banner></Banner>
    <!-- hiển thị sản phẩm bán chạy  -->
    <div class="bg-gray-100 py-20 pt-">
      <div class="container mx-auto">
        <div class="text-center mb-10">
          <h2 class="text-3xl font-bold">Sản phẩm bán nhiều nhất</h2>
          <p class="text-gray-500">Khám phá các lựa chọn hàng đầu hiện tại</p>
        </div>
        <div class="container mx-auto py-10">
          <!-- Sử dụng flexbox để bố trí các sản phẩm theo chiều ngang -->
          <div class="flex justify-center space-x-5 w-full">
            <!-- Vòng lặp qua sản phẩm -->
            <div v-for="product in products
              .sort((a, b) => b.sales - a.sales)
              .slice(0, 1)" :key="product.id" class="w-1/4 cursor-pointer bg-white group border border-gray-300">
              <div @click="nextCard(product.id)" class="relative">
                <img :src="product.image" class="w-56 h-56 object-cover ml-36 mt-6" />
                <div class="absolute inset-0 flex flex-col justify-start p-5 bg-white bg-opacity-10">
                  <h3 class="text-2xl font-bold">
                    {{ product.name.split(" ").slice(1, 2).join(" ") }}
                    <br />
                    {{ product.name.split(" ").slice(2, 3).join(" ") }}
                  </h3>
                  <p class="text-gray-600">{{ product.category }}</p>
                </div>
                <!-- Hiệu ứng đường kẻ khi hover -->
                <div class="absolute inset-0 flex justify-center items-center">
                  <div
                    class="absolute top-[-24px] left-0 w-0 h-[2px] bg-black group-hover:w-full transition-all duration-500">
                  </div>
                  <div
                    class="absolute bottom-0 left-0 w-0 h-[2px] bg-black group-hover:w-full transition-all duration-500">
                  </div>
                  <div
                    class="absolute top-[-24px] left-0 h-0 w-[2px] bg-black group-hover:h-[248px] transition-all duration-500">
                  </div>
                  <div
                    class="absolute top-[-24px] right-0 h-0 w-[2px] bg-black group-hover:h-[248px] transition-all duration-500">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- end-hiển thị sản phẩm bán chạy  -->
    <!-- hiển thị theo danh mục -->
    <div v-for="category in category" :key="category.id" class="py-10 mt-10 cursor-pointer">
      <div class="text-center">
        <h2 class="text-2xl font-semibold mb-2">{{ category.name }}</h2>
        <p class="text-gray-500 mb-6">{{ category.description }}</p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
        <div v-for="item in products.filter((item) => item.category == category.name).slice(0, 4)" :key="item.id" @click="nextCard(item.id)" class="bg-white rounded-lg shadow-md p-4 relative hover:border-black transition-all duration-300 hover:shadow-2xl">
          <div @click.stop="handleLike(item, $event)">
            <i v-if="user?.like.some((i) => i.id === item.id)" class="fa-solid fa-heart text-red-600 hover:text-black"></i>
            <i v-else class="fa-regular fa-heart hover:text-red-600"></i>
          </div>
          <div class="bg-red-500 text-white text-sm px-2 py-1 rounded-full absolute top-2 right-2">New</div>
          <img :src="item.image" class="w-full h-60 object-cover rounded" />
          <h3 class="mt-4 text-gray-800 text-lg font-semibold truncate">{{ item.name }}</h3>
          <p class="text-orange-500 font-semibold mt-2">{{ formatVND(item.price) }}</p>
        </div>
      </div>
    </div>
    <!-- end-hiển thị theo danh mục -->

    <!-- hiển thị tìm kiếm -->
    <div class="w-full flex justify-center mt-32 mb-[-50px]">
      <div class="w-[70%] bg-gray-900 p-12 rounded text-white shadow-lg">
        <div class="flex items-center mb-4">
          <input class="w-64 rounded h-8 text-black p-2" v-model="searchTerm" type="text" placeholder="Tìm kiếm sản phẩm..." />
        </div>
        <div class="flex gap-4 items-center">
          <!-- Lọc theo năm -->
          <select v-model="yearFilter" class="w-1/3 p-3 bg-gray-200 text-black rounded">
            <option value="">Lọc theo năm</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
          </select>

          <!-- Lọc theo danh mục -->
          <select v-model="categoryFilter" class="w-1/3 p-3 bg-gray-200 text-black rounded">
            <option value="">Lọc theo danh mục</option>
            <option v-for="item in category" :key="item.id" :value="item.name">{{ item.name }}</option>
          </select>

          <!-- Lọc theo giá -->
          <select v-model="priceFilter" class="w-1/3 p-3 bg-gray-200 text-black rounded">
            <option value="">Lọc theo giá</option>
            <option value="200"> dưới 200k</option>
            <option value="200-300">Khoảng 200 - 300k</option>
            <option value="30">trên 300k</option>
          </select>

          <!-- Sắp xếp theo giá -->
          <select v-model="sortOrder" class="w-1/3 p-3 bg-gray-200 text-black rounded">
            <option value="">Sắp xếp theo giá</option>
            <option value="up">Tăng dần</option>
            <option value="down">Giảm dần</option>
          </select>

          <!-- Nút RESET -->
          <button @click="resetFilters" class="flex items-center gap-2 p-3 bg-purple-600 text-white rounded hover:bg-purple-700">
            RESET
          </button>
        </div>
      </div>
    </div>
    <!-- end-hiển thị tìm kiếm -->

    <div className="text-center mt-40" v-if="paginatedProducts.length == 0">
      <h1 className="text-4xl font-bold">Không tìm thấy sản phẩm</h1>
      <p className="text-gray-500 mt-2">Vui lòng tìm kiếm sản phẩm khác!</p>
    </div>

    <!-- Hiển thị tất cả danh sách sản phẩm -->
    <div class="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-10">
      <div v-for="(item, index) in paginatedProducts" :key="index" class="p-4">
        <div class="bg-gray-800 text-white shadow-lg border-2 border-gray hover:border-black transition-all duration-300 hover:shadow-2xl">
          <img :src="item.image" alt="Product Image" class="w-full h-[340px]" />
          <div class="p-4">
            <h2 class="text-lg truncate">{{ item.name }}</h2>
            <div class="flex justify-between mt-2 mb-4 border-b pb-2">
              <button @click="nextCard(item.id)" class="bg-red-600 text-white py-1 px-3 rounded">Mua ngay</button>
              <div class="text-yellow-300 text-lg">{{ formatVND(item.price) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- end-hiển thị tất cả danh sách sản phẩm -->

    <!-- hiển thị form yêu thích -->
    <div v-if="showLike" class="text-center my-4 fixed inset-0 flex items-end justify-center z-50">
      <div class="bg-gray-800 text-white text-sm px-6 py-4 rounded mt-4 inline-block max-w-md shadow-lg">
        <span>Sản phẩm đã được thêm vào yêu thích <i class="fa-solid fa-heart-circle-check text-red-500"></i></span>
        <button @click="nextLike" class="text-pink-500 font-bold hover:text-pink-700 ml-4">Xem</button>
      </div>
    </div>
    <div v-if="disLike" class="text-center my-4 fixed inset-0 flex items-end justify-center z-50">
      <div class="bg-gray-800 text-white text-sm px-6 py-4 rounded mt-4 inline-block max-w-md shadow-lg">
        <span>Đã bỏ yêu thích sản phẩm <i class="fa-solid fa-heart-circle-xmark"></i></span>
        <button @click="nextLike" class="text-pink-500 font-bold hover:text-pink-700 ml-4">Xem</button>
      </div>
    </div>

    <!-- Phân trang -->
    <div v-if="!paginatedProducts.length == 0" class="flex justify-center space-x-2 mt-4">
      <button @click="prevPage" :disabled="currentPage === 1" :class="[
        'py-1 border rounded',
        {
          'bg-gray-400 cursor-not-allowed opacity-50': currentPage === 1,
          'bg-blue-500 text-white': currentPage > 1,
        },
      ]">
        <i class="px-[9px] fa-solid fa-arrow-left"></i>
      </button>
      <button v-for="page in totalPages" :key="page" @click="currentPage = page" :class="[
        'px-3 py-1 border rounded',
        { 'bg-blue-500 text-white': currentPage === page },
      ]">
        {{ page }}
      </button>
      <button @click="nextPage" :disabled="currentPage === totalPages" :class="[
        'py-1 border rounded',
        {
          'bg-gray-400 cursor-not-allowed opacity-50':
            currentPage === totalPages,
          'bg-blue-500 text-white': currentPage < totalPages,
        },
      ]">
        <i class="px-[9px] fa-solid fa-arrow-right"></i>
      </button>
    </div>
    <!-- end-hiển thị form yêu thích -->
    <div v-if="showBan" class="text-center my-4 fixed inset-0 flex items-end justify-center z-50">
      <div class="bg-red-500 text-white text-sm px-6 py-4 rounded mt-4 inline-block max-w-md shadow-lg">
        <span>Tài khoản đã bị chặn, vui lòng sử dụng tài khoản khác</span>
        <button @click="closeBan" class="text-black font-bold hover:text-gray-700 ml-4">Close</button>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import apiClient from "@/api/instance";
import Banner from "@/components/Banner.vue";
import Footer from "@/components/Footer.vue";
import Header from "@/components/Header.vue";
import { computed, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const store = useStore();
const router = useRouter();
const products = ref([]);
const category = ref([]);
const user = ref(null);
const showLike = ref(false);
const disLike = ref(false);
const showFeedback = ref(false);
const showBan = ref(false);
const userLocal = JSON.parse(localStorage.getItem("userLogin") || "null");
const users = ref([]);

const closeBan = () => {
  showBan.value = false;
  router.push('/login');
  localStorage.removeItem("userLogin");
};

// Các biến để lọc, tìm kiếm, sắp xếp
const searchTerm = ref("");
const yearFilter = ref("");
const categoryFilter = ref("");
const priceFilter = ref("");
const sortOrder = ref("");

// Phân trang
const currentPage = ref(1);
const itemsPerPage = 6;

// Lấy danh sách sản phẩm cho trang hiện tại
const paginatedProducts = computed(() => {
  const filteredProducts = filteredAndSortedProducts.value;
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredProducts.slice(start, end);
});

// Tính tổng số trang
const totalPages = computed(() => {
  return Math.ceil(filteredAndSortedProducts.value.length / itemsPerPage);
});

// Lọc và sắp xếp sản phẩm
const filteredAndSortedProducts = computed(() => {
  let filtered = products.value;

  // Lọc theo tìm kiếm
  if (searchTerm.value) {
    filtered = filtered.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.value.toLowerCase())
    );
  }

  // Lọc theo năm
  if (yearFilter.value) {
    filtered = filtered.filter((item) =>
      item.created_at.includes(yearFilter.value)
    );
  }

  // Lọc theo danh mục
  if (categoryFilter.value) {
    filtered = filtered.filter(
      (item) => item.category === categoryFilter.value
    );
  }

  // Lọc theo giá
  if (priceFilter.value === "200") {
    filtered = filtered.filter((item) => item.price < 200000);
  } else if (priceFilter.value === "200-300") {
    filtered = filtered.filter(
      (item) => item.price >= 200000 && item.price <= 300000
    );
  } else if (priceFilter.value === "300") {
    filtered = filtered.filter((item) => item.price > 300000);
  }

  // Sắp xếp theo giá
  if (sortOrder.value === "up") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortOrder.value === "down") {
    filtered.sort((a, b) => b.price - a.price);
  }

  return filtered;
});

const messFeedback = ref(false);
// bật form feedback
const onFeedback = () => {
  showFeedback.value = true;
};
// tắt
const closeFeedback = () => {
  showFeedback.value = false;
};
const feedback = () => {
  showFeedback.value = false;
  messFeedback.value = true;
  setTimeout(() => {
    messFeedback.value = false;
  }, 3000);
};
const closeMessFeedback = () => {
  messFeedback.value = false;
};

// Chuyển đến trang trước
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

// Chuyển đến trang tiếp theo
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

watch(users, (newUsers) => {
  if (userLocal && newUsers.length > 0) {
    user.value = newUsers.find((item) => item.id === userLocal.id);
    if (user.value.status == false) {
      showBan.value = true;
    }
  }
  if (user.value && !user.value.like) {
    user.value.like = [];
  }
});

// thay đổi yêu thích của user
const handleLike = (item, event) => {
  event.stopPropagation();
  if (userLocal == 'null' || !userLocal) {
    router.push('/login');
    return;
  }
  if (user.value.like.some((i) => i.id === item.id)) {
    user.value.like = user.value.like.filter((idLike) => idLike.id !== item.id);
    disLike.value = true;
    setTimeout(() => {
      disLike.value = false;
    }, 2000);
  } else {
    user.value.like.push(item);
    showLike.value = true;
    setTimeout(() => {
      showLike.value = false;
    }, 2000);
  }
  store.dispatch("apiEditCustomer", user.value);
};

const nextLike = () => {
  router.push('/myLike');
};

// Lấy dữ liệu sản phẩm từ API
const fetchData = async () => {
  try {
    const respones = await apiClient("products");
    const categoryRp = await apiClient("classify");
    const usersRp = await apiClient("users");
    products.value = respones.data;
    category.value = categoryRp.data;
    users.value = usersRp.data;
  } catch (err) {
    console.log(err);
  }
};

// Định dạng giá tiền VND
const formatVND = (price) => {
  return price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
};

// Điều hướng tới trang chi tiết sản phẩm
const nextCard = (id) => {
  router.push(`/card/${id}`);
};

// Reset các bộ lọc và tìm kiếm
const resetFilters = () => {
  searchTerm.value = "";
  yearFilter.value = "";
  categoryFilter.value = "";
  priceFilter.value = "";
  sortOrder.value = "";
  currentPage.value = 1;
};

onMounted(() => {
  fetchData();
});
</script>

<style>
/* Thêm CSS tùy chỉnh nếu cần */
</style>

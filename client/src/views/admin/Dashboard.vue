<template>
  <div>
    <div class="flex">
      <main class="flex-1 p-5 bg-gray-100">
        <div class="bg-white p-8 rounded-lg shadow-lg">
          <div class="grid grid-cols-3 gap-6">
            <!-- Số sản phẩm đã bán -->
            <div
              class="p-6 bg-white border border-gray-700 text-black rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
            >
              <div class="flex items-center">
                <div class="mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-10 w-10 text-black"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 12h14M5 12l5-5m0 10l-5-5m14 0l-5-5m0 10l5-5"
                    />
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-bold">Số sản phẩm đã bán</h3>
                  <p class="mt-2 text-3xl font-extrabold">
                    {{ totalSoldProducts }}
                  </p>
                </div>
              </div>
            </div>
            <!-- Doanh thu -->
            <div
              class="p-6 bg-white border border-gray-700 text-black rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
            >
              <div class="flex items-center">
                <div class="mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-10 w-10 text-black"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4"
                    />
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-bold">Doanh thu</h3>
                  <p class="mt-2 text-3xl font-extrabold">
                    {{ formatVND(totalRevenue) }}
                  </p>
                </div>
              </div>
            </div>
            <!-- Sản phẩm trong kho -->
            <div
              class="p-6 bg-white border border-gray-700 text-black rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
            >
              <div class="flex items-center">
                <div class="mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-10 w-10 text-black"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 3v4M3 7h18m-2-4v4M6 17l2-2m4 4l2-2m4 4l2-2m-6-6l2-2m4 4l2-2M3 7l9 9m9-9l-9 9"
                    />
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-bold">Sản phẩm trong kho</h3>
                  <p class="mt-2 text-3xl font-extrabold">{{ totalStock }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import apiClient from "@/api/instance";

const products = ref([]);
const totalSoldProducts = ref(0);
const totalRevenue = ref(0);
const totalStock = ref(0);

// Hàm lấy dữ liệu sản phẩm từ API
const fetchData = async () => {
  try {
    const response = await apiClient.get("products");
    products.value = response.data;

    // Gọi các hàm tính toán sau khi lấy dữ liệu
    calculateTotalSoldProducts();
    calculateTotalRevenue();
    calculateTotalStock();
  } catch (error) {
    console.error(error);
  }
};

// Tính tổng số sản phẩm đã bán
const calculateTotalSoldProducts = () => {
  totalSoldProducts.value = 0;
  products.value.forEach((product) => {
    totalSoldProducts.value += product.sales;
  });
};

// Tính tổng doanh thu
const calculateTotalRevenue = () => {
  totalRevenue.value = 0;
  products.value.forEach((product) => {
    totalRevenue.value += product.sales * product.price;
  });
};

// Tính tổng số sản phẩm trong kho
const calculateTotalStock = () => {
  totalStock.value = 0;
  products.value.forEach((product) => {
    if (product.stock > 0) {
      totalStock.value += product.stock;
    }
  });
};

// format tiền
const formatVND = (price) => {
  if (price) {
    return price.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  }
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.hover\:scale-105:hover {
  transform: scale(1.05);
}

.transition-transform {
  transition: transform 0.3s ease-in-out;
}
</style>

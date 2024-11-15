<template>
  <div class="flex">
    <main class="flex-1 p-5 bg-gray-50">
      <header class="flex justify-between items-center mb-6"></header>
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <div class="flex justify-between mb-4">
          <button
            @click="showForm({}, 'add')"
            class="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition duration-300"
          >
            + Add Product
          </button>
          <div class="flex gap-4">
            <!-- Lọc theo danh mục -->
            <select
              v-model="selectedCategory"
              class="border border-gray-300 px-4 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Lọc theo danh mục</option>
              <option
                v-for="item in category"
                :key="item.id"
                :value="item.name"
              >
                {{ item.name }}
              </option>
            </select>
            <!-- Sắp xếp theo giá -->
            <select
              v-model="sortOption"
              class="border border-gray-300 px-4 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Lọc theo giá</option>
              <option value="price-asc">Giá: Từ thấp đến cao</option>
              <option value="price-desc">Giá: Từ cao đến thấp</option>
            </select>
            <!-- tìm kiếm theo tên -->
            <input
              v-model="NameSearch"
              type="text"
              class="border border-gray-300 px-4 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Tìm kiếm theo tên"
            />
          </div>
        </div>
        <!-- Bảng sản phẩm -->
        <table
          class="table-auto w-full border-collapse border border-gray-200 rounded-lg shadow-lg"
        >
          <thead class="bg-gray-100">
            <tr>
              <th class="px-4 py-2 border">STT</th>
              <th class="px-4 py-2 border">Ảnh</th>
              <th class="px-4 py-2 border">Tên</th>
              <th class="px-4 py-2 border">Trạng thái</th>
              <th class="px-4 py-2 border">Danh mục</th>
              <th class="px-4 py-2 border">Giá</th>
              <th class="px-4 py-2 border">Ngày tạo</th>
              <th class="px-4 py-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(product, index) in paginatedProducts"
              :key="product.id"
              class="text-center hover:bg-gray-50"
            >
              <td class="px-4 py-2 border">
                {{ index + 1 + (currentPage - 1) * pageSize }}
              </td>
              <td class="px-4 py-2 border">
                <div class="flex justify-center">
                  <img
                    :src="product.image"
                    alt="product.name"
                    class="w-12 h-12 rounded-lg object-cover"
                  />
                </div>
              </td>
              <td class="px-4 py-2 border truncate max-w-xs">
                {{ product.name }}
              </td>
              <td class="px-4 py-2 border">
                <span
                  :class="{
                    'text-green-600 font-bold': product.status,
                    'text-red-600 font-bold': !product.status,
                  }"
                >
                  {{ product.status ? "Đang bán" : "Ngừng bán" }}
                </span>
              </td>
              <td class="px-4 py-2 border">{{ product.category }}</td>
              <td class="px-4 py-2 border">{{ formatVND(product.price) }}</td>
              <td class="px-4 py-2 border">{{ product.created_at }}</td>
              <td class="px-4 py-2 border">
                <div class="flex justify-center gap-2">
                  <button
                    @click="showForm(product, 'edit')"
                    class="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition duration-300"
                  >
                    Edit
                  </button>
                  <button
                    @click="deleteProduct(product.id)"
                    class="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition duration-300"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Phân trang -->
        <div class="flex justify-center space-x-2 mt-4">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="px-3 py-1 border rounded-lg bg-gray-200 text-gray-600 hover:bg-blue-500 hover:text-white transition disabled:bg-gray-400 disabled:text-gray-300"
          >
            <i class="fas fa-arrow-left"></i>
          </button>
          <button
            v-for="page in totalPages"
            :key="page"
            @click="currentPage = page"
            class="px-3 py-1 border rounded-lg"
            :class="{
              'bg-blue-500 text-white': currentPage === page,
              'hover:bg-gray-200': currentPage !== page,
            }"
          >
            {{ page }}
          </button>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="px-3 py-1 border rounded-lg bg-gray-200 text-gray-600 hover:bg-blue-500 hover:text-white transition disabled:bg-gray-400 disabled:text-gray-300"
          >
            <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>
      <ProductForm
        :product="editingProduct"
        :categories="categories"
        @onSubmit="handleSubmitForm"
      />
    </main>
    <Form
      v-if="isShow"
      @onClose="handleClose"
      :item="itemProduct"
      :act="action"
    ></Form>
    <Delete
      v-if="isShowDelete"
      @close="handleCloseDelete"
      @deleteConfirm="handleDelete"
    ></Delete>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import apiClient from "@/api/instance";
import Form from "@/components/Form.vue";
import Delete from "@/components/Delete.vue";

const products = ref([]);
const category = ref([]);
const NameSearch = ref("");
const sortOption = ref("");
const selectedCategory = ref("");
const currentPage = ref(1);
const pageSize = ref(5);
const editingProduct = ref(null);
const isShow = ref(false);
const isShowDelete = ref(false);
const action = ref("");
const itemProduct = ref({});

// Hàm lấy dữ liệu từ API
const fetchData = async () => {
  try {
    const response = await apiClient.get("products");
    const response2 = await apiClient.get("classify");
    products.value = response.data;
    category.value = response2.data;
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  fetchData();
});

// Format tiền VND
const formatVND = (price) => {
  return price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
};

// Hàm tìm kiếm, sắp xếp, và lọc sản phẩm
const filteredAndSortedProducts = computed(() => {
  let filteredProducts = products.value;

  if (NameSearch.value) {
    filteredProducts = filteredProducts.filter((product) =>
      product.name.toLowerCase().includes(NameSearch.value.toLowerCase())
    );
  }

  if (selectedCategory.value) {
    filteredProducts = filteredProducts.filter(
      (product) => product.category === selectedCategory.value
    );
  }

  if (sortOption.value === "price-asc") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortOption.value === "price-desc") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  return filteredProducts;
});

// Phân trang
const totalPages = computed(() => {
  return Math.ceil(filteredAndSortedProducts.value.length / pageSize.value);
});

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredAndSortedProducts.value.slice(start, end);
});

// Chuyển trang
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

// Hàm show form thêm/sửa
const showForm = (product, act) => {
  itemProduct.value = product;
  action.value = act;
  isShow.value = true;
};

// Hàm đóng form
const handleClose = () => {
  isShow.value = false;
  fetchData();
};

// Hàm xóa sản phẩm
const deleteProduct = (id) => {
  itemProduct.value = id;
  isShowDelete.value = true;
};

const handleCloseDelete = () => {
  isShowDelete.value = false;
  fetchData();
};

const handleDelete = async () => {
  await apiClient.delete(`products/${itemProduct.value}`);
  isShowDelete.value = false;
  fetchData();
};

const handleSubmitForm = () => {
  fetchData();
};
</script>

<style scoped>
/* Không cần thêm nhiều styles vì đã sử dụng Tailwind */
</style>

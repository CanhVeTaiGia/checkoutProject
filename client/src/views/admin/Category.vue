<template>
  <div class="flex">
    <main class="flex-1 p-5 bg-gray-50">
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <div class="flex justify-between mb-4">
          <button
            @click="showForm('', 'add')"
            class="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition duration-300"
          >
            + Add Category
          </button>
          <div class="flex gap-2">
            <!-- tìm kiếm theo tên -->
            <input
              v-model="NameSearch"
              type="text"
              class="border border-gray-300 px-4 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Lọc theo tên"
            />

            <!-- Lọc theo trạng thái -->
            <select class="border border-gray-300 px-4 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500" v-model="filterStatus">
              <option value="">Lọc theo trạng thái</option>
              <option value="true">Mở</option>
              <option value="false">Đóng</option>
            </select>

            <!-- Sắp xếp theo tên -->
            <select class="border border-gray-300 px-4 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500" v-model="sortOrder">
              <option value="">Sắp xếp theo tên</option>
              <option value="az">Sắp xếp từ A đến Z</option>
              <option value="za">Sắp xếp từ Z đến A</option>
            </select>
          </div>
        </div>
        <table class="table-auto w-full border-collapse border border-gray-200">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-4 py-2 border text-center">STT</th>
              <th class="px-4 py-2 border text-center">Name</th>
              <th class="px-4 py-2 border text-center">Trạng thái</th>
              <th class="px-4 py-2 border text-center">Mô tả</th>
              <th class="px-4 py-2 border text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in categoryPage"
              :key="item.id"
              class="text-center"
            >
              <td class="px-4 py-2 border">
                {{ (currentPage - 1) * itemPage + index + 1 }}
              </td>
              <td class="px-4 py-2 border truncate max-w-xs">
                <p class="truncate overflow-hidden whitespace-nowrap">
                  {{ item.name }}
                </p>
              </td>
              <td class="px-4 py-2 border">
                <span
                  :class="{
                    'text-green-600 font-bold': item.status,
                    'text-red-600 font-bold': !item.status,
                  }"
                >
                  {{ item.status ? "Mở" : "Đóng" }}
                </span>
              </td>
              <td class="px-4 py-2 border">{{ item.description }}</td>
              <td class="px-4 py-2 border">
                <div class="flex justify-center gap-2">
                  <button
                    @click="showForm(item, 'edit')"
                    class="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    @click="deleteProduct(item.id)"
                    class="bg-red-500 text-white px-3 py-1 rounded"
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
          <button @click="prevPage" :disabled="currentPage === 1" :class="['py-1 border rounded', { 'bg-gray-400 cursor-not-allowed opacity-50': currentPage === 1, 'bg-blue-500 text-white': currentPage > 1 }]">
            <i class="px-[9px] fa-solid fa-arrow-left"></i>
          </button>
          <button v-for="page in totalPages" :key="page" @click="currentPage = page" :class="['px-3 py-1 border rounded', { 'bg-blue-500 text-white': currentPage === page }]">
            {{ page }}
          </button>
          <button @click="nextPage" :disabled="currentPage === totalPages" :class="['py-1 border rounded', { 'bg-gray-400 cursor-not-allowed opacity-50': currentPage === totalPages, 'bg-blue-500 text-white': currentPage < totalPages }]">
            <i class="px-[9px] fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </main>
    <Form
      v-if="isShow"
      @onClose="closeForm"
      @update="fetchData()"
      :new="newCategory"
      :act="action"
    ></Form>
    <Delete
      v-if="showDelete"
      @update="fetchData()"
      @deleteConfirm="deleteConfirm()"
      @close="closeShow"
    ></Delete>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import Form from "@/components/FormCategory.vue";
import Delete from "@/components/Delete.vue";
import { useStore } from "vuex";
import apiClient from "@/api/instance";

const NameSearch = ref("");
const showDelete = ref(false);
const category = ref([]);
const store = useStore();
const newCategory = reactive({
  id: Math.ceil(Math.random() * 9999999),
  name: "",
  description: "",
  status: true,
});

const action = ref();
const isShow = ref(false);
const currentPage = ref(1); // Trang hiện tại
const itemPage = 5; // Số danh mục mỗi trang

// Lọc và sắp xếp danh mục
const filterStatus = ref("");
const sortOrder = ref("");

// Tính toán số trang
const totalPages = computed(() => {
  return Math.ceil(filteredAndSortedCategories.value.length / itemPage);
});

// Lấy danh mục hiển thị cho trang hiện tại
const categoryPage = computed(() => {
  const start = (currentPage.value - 1) * itemPage;
  const end = start + itemPage;
  return filteredAndSortedCategories.value.slice(start, end);
});

// Lọc và sắp xếp danh mục
const filteredAndSortedCategories = computed(() => {
  let filteredCategories = category.value;

  // Tìm kiếm theo tên
  if (NameSearch.value) {
    filteredCategories = filteredCategories.filter(item =>
      item.name.toLowerCase().includes(NameSearch.value.toLowerCase())
    );
  }

  // Lọc theo trạng thái
  if (filterStatus.value !== "") {
    filteredCategories = filteredCategories.filter(item => item.status === (filterStatus.value === "true"));
  }

  // Sắp xếp theo tên
  if (sortOrder.value === "az") {
    filteredCategories.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortOrder.value === "za") {
    filteredCategories.sort((a, b) => b.name.localeCompare(a.name));
  }

  return filteredCategories;
});

// Hàm lấy dữ liệu danh mục với tìm kiếm, lọc, sắp xếp, và phân trang
const fetchData = async () => {
  try {
    const response = await apiClient.get("classify");
    category.value = response.data;  // Assign the data to category list
  } catch (error) {
    console.error(error);
  }
};

// Khởi tạo dữ liệu khi component được mount
onMounted(() => {
  fetchData();
});

// Hàm chọn trang
const selectPage = (page) => {
  currentPage.value = page;
  fetchData();
};

// Hàm chuyển đến trang trước
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    fetchData();
  }
};

// Hàm chuyển đến trang tiếp theo
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    fetchData();
  }
};

const showForm = (item, act) => {
  isShow.value = true;
  action.value = act;
  if (act === "edit") {
    newCategory.name = item.name;
    newCategory.id = item.id;
    newCategory.description = item.description;
    newCategory.status = item.status;
  } else {
    newCategory.name = "";
    newCategory.id = Math.ceil(Math.random() * 9999999);
    newCategory.description = "";
    newCategory.status = true;
  }
};

const closeForm = () => {
  isShow.value = false;
  fetchData();
};

const idDelete = ref(null);

const deleteProduct = (id) => {
  idDelete.value = id;
  showDelete.value = true;
};

const deleteConfirm = () => {
  store.dispatch("apiDeleteCategory", idDelete.value);
  showDelete.value = false;
  fetchData();
};

const closeShow = () => {
  showDelete.value = false;
  fetchData();
};
</script>

<style></style>
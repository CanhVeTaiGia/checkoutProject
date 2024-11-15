<template>
  <div className="flex">
    <main className="flex-1 p-5 bg-gray-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between mb-4">
          <div className="flex gap-4">
            <!-- {/* Lọc theo vai trò */} -->
            <select
              v-model="filterRole"
              className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Lọc theo vai trò</option>
              <option :value="true">Admin</option>
              <option :value="false">Users</option>
            </select>
            <!-- {/* Sắp xếp theo tên */} -->
            <select
              v-model="sortOption"
              className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Sắp xếp theo tên</option>
              <option value="az">Sắp xếp A-Z</option>
              <option value="za">Sắp xếp Z-A</option>
            </select>
          </div>

          <!-- tìm kiếm theo tên -->
          <input
            v-model="NameSearch"
            type="text"
            class="border border-gray-300 px-4 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="Tìm kiếm theo tên"
          />
        </div>

        <!-- {/* Hiển thị danh sách người dùng */} -->
        <table
          className="table-auto w-full border-collapse border border-gray-200 text-center"
        >
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">STT</th>
              <th className="px-4 py-2 border">Avatar</th>
              <th className="px-4 py-2 border">Tên</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Phone</th>
              <th className="px-4 py-2 border">Role</th>
              <th className="px-4 py-2 border">Ngày tạo</th>
              <th className="px-4 py-2 border">Action</th>
            </tr>
          </thead>
          <tbody v-for="(item, index) in paginatedCustomers" :key="item.id">
            <tr>
              <td className="px-4 py-2 border">{{ index + 1 }}</td>
              <td className="px-4 py-2 border">
                <div className="flex justify-center items-center">
                  <img
                    className="h-10 w-10 rounded-full"
                    :src="item.avatar"
                    :alt="item.name"
                  />
                </div>
              </td>
              <td className="px-4 py-2 border">{{ item.name }}</td>
              <td className="px-4 py-2 border">{{ item.email }}</td>
              <td className="px-4 py-2 border">{{ item.phone }}</td>
              <td className="px-4 py-2 border">
                <button className="text-black px-3 py-1 rounded">
                  {{ item.role ? "Admin" : "User" }}
                </button>
              </td>
              <td className="px-4 py-2 border">{{ item.created_at }}</td>
              <td className="px-4 py-2 border">
                <div
                  @click="handleStatus(item)"
                  className="flex justify-center gap-2 cursor-pointer"
                >
                  <div v-if="!item.role">
                    <i
                      v-if="!item.status"
                      class="fa-solid fa-lock text-red-500"
                    ></i>
                    <i v-else class="fa-solid fa-unlock text-green-500"></i>
                  </div>
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
        <Edit
          v-if="isShow"
          @editConfirm="updateCustomer"
          @close="closeUpdate"
        ></Edit>
      </div>
    </main>
  </div>
</template>

<script setup>
import apiClient from "@/api/instance";
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
import Edit from "@/components/Edit.vue";

const store = useStore();
const customer = ref([]);
const customerUpdate = ref(null);
const NameSearch = ref("");
const sortOption = ref("");
const filterRole = ref("");

// Phân trang
const currentPage = ref(1);
const pageSize = ref(5); // Số lượng khách hàng trên mỗi trang

// Lọc và sắp xếp khách hàng
const filteredAndSortedCustomers = computed(() => {
  let filteredCustomers = customer.value;

  // Lọc theo tên
  if (NameSearch.value) {
    filteredCustomers = filteredCustomers.filter(
      (item) => item.name.toLowerCase().includes(NameSearch.value.toLowerCase())
      // includes trả về true nếu tìm thấy, toLowerCase giúp k phân biệt hoa thường
    );
  }

  // Lọc theo vai trò
  if (filterRole.value !== "") {
    filteredCustomers = filteredCustomers.filter(
      (item) => item.role === filterRole.value
    );
  }

  // Sắp xếp theo tên
  if (sortOption.value === "az") {
    filteredCustomers.sort((a, b) => a.name.localeCompare(b.name));
    // localeCompare so sánh vị trị trong bản chữ cái
  } else if (sortOption.value === "za") {
    filteredCustomers.sort((a, b) => b.name.localeCompare(a.name));
  }
  return filteredCustomers;
});

// Tính tổng số trang
const totalPages = computed(() => {
  return Math.ceil(filteredAndSortedCustomers.value.length / pageSize.value);
});

// Lấy dữ liệu khách hàng cho trang hiện tại
const paginatedCustomers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredAndSortedCustomers.value.slice(start, end);
});
// Chuyển sang trang tiếp theo
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

// Quay lại trang trước
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const fetchData = async () => {
  try {
    const response = await apiClient.get("users");
    customer.value = response.data;
  } catch (err) {
    console.log(err);
  }
};

onMounted(() => {
  fetchData();
});

const isShow = ref(false);

// Mở modal
const handleStatus = (customer) => {
  isShow.value = true;
  customerUpdate.value = customer;
};

// Đóng modal
const closeUpdate = () => {
  isShow.value = false;
};

const updateCustomer = () => {
  customerUpdate.value.status = !customerUpdate.value.status;
  store.dispatch("apiEditCustomer", customerUpdate.value);
  isShow.value = false;
  customerUpdate.value = null;
};
</script>

<style></style>
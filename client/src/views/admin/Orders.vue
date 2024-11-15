<template>
  <div className="flex">
    <main className="flex-1 p-5 bg-gray-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between mb-4">
          <div className="flex gap-4">
            <select
              v-model="sortOption"
              class="border border-gray-300 px-4 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Sắp xếp theo ngày</option>
              <option value="moi">Sắp xếp từ cũ đến mới</option>
              <option value="cu">Sắp xếp từ mới đến cũ</option>
            </select>
            <select
              v-model="filterStatus"
              class="border border-gray-300 px-4 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Lọc theo trạng thái</option>
              <option value="choDuyet">Chờ duyệt</option>
              <option value="daDuyet">Đã duyệt</option>
              <option value="daGui">Giao hàng thành công</option>
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

        <table class="table-auto w-full border-collapse border border-gray-200">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-4 py-2 border">Mã đơn hàng</th>
              <th class="px-4 py-2 border">Tên người nhận</th>
              <th class="px-4 py-2 border">Địa chỉ nhận</th>
              <th class="px-4 py-2 border">Số người nhận</th>
              <th class="px-6 py-2 border">Trạng thái</th>
              <th class="px-4 py-2 border">Tổng tiền</th>
              <th class="px-4 py-2 border">Ngày tạo</th>
              <th class="px-4 py-2 border">Note</th>
              <th class="px-8 py-2 border">Action</th>
            </tr>
          </thead>
          <tbody v-for="item in paginatedOrders" :key="item.id">
            <tr>
              <td class="px-4 py-2 border">{{ item.id }}</td>
              <td class="px-4 py-2 border">{{ item.name }}</td>
              <td class="px-4 py-2 border">{{ item.address }}</td>
              <td class="px-4 py-2 border">{{ item.phone }}</td>
              <td class="px-4 py-2 border">
                <span
                  :class="{
                    'text-yellow-500 font-bold': item.status === 'choDuyet',
                    'text-green-600 font-bold': item.status === 'daDuyet',
                    'text-blue-500 font-bold': item.status === 'daGui',
                  }"
                >
                  {{
                    item.status === "choDuyet"
                      ? "Chờ duyệt"
                      : item.status === "daDuyet"
                      ? "Đã duyệt"
                      : "Đã gửi"
                  }}
                </span>
              </td>
              <td class="px-4 py-2 border">
                {{ formatVND(total(item) + item.ship) }}
              </td>
              <td class="px-4 py-2 border">{{ item.created_at }}</td>
              <td class="px-4 py-2 border">{{ item.note }}</td>
              <td class="px-4 py-2 border">
                <button
                  @click="handleShowOrder(item)"
                  class="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition duration-300"
                >
                  Chi tiết
                </button>
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
      <FormOrder
        v-if="isShow"
        @onClose="handleClose"
        :new="editCategory"
      ></FormOrder>
    </main>
  </div>
</template>

<script setup>
import apiClient from "@/api/instance";
import FormOrder from "@/components/FormOrder.vue";
import { computed, onMounted, ref } from "vue";

const editCategory = ref();
const isShow = ref(false);
const NameSearch = ref("");
const sortOption = ref("");
const filterStatus = ref("");
const currentPage = ref(1);
const pageSize = ref(5);
const filteredAndSortedOrders = computed(() => {
  let filteredOrders = orders.value;

  // Tìm kiếm theo tên
  if (NameSearch.value) {
    filteredOrders = filteredOrders.filter((order) =>
      order.name.toLowerCase().includes(NameSearch.value.toLowerCase())
    );
  }

  // Lọc theo trạng thái
  if (filterStatus.value) {
    filteredOrders = filteredOrders.filter(
      (order) => order.status === filterStatus.value
    );
  }

  // Sắp xếp theo ngày
  if (sortOption.value === "moi") {
  filteredOrders.sort(
    (a, b) => Date.parse(a.created_at) - Date.parse(b.created_at)
  );
} else if (sortOption.value === "cu") {
  filteredOrders.sort(
    (a, b) => Date.parse(b.created_at) - Date.parse(a.created_at)
  );
}
return filteredOrders;
});
// Tính tổng số trang
const totalPages = computed(() => {
  return Math.ceil(filteredAndSortedOrders.value.length / pageSize.value);
});

// Lấy danh sách đơn hàng cho trang hiện tại
const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredAndSortedOrders.value.slice(start, end);
});
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

const handleShowOrder = (item) => {
  isShow.value = true;
  editCategory.value = item;
};
const handleClose = () => {
  isShow.value = false;
};
const orders = ref([]);
const sales = ref([]);
const fetchData = async () => {
  try {
    const response = await apiClient.get("orders");
    const response2 = await apiClient.get("sales");
    orders.value = response.data;
    sales.value = response2.data;
  } catch (err) {
    console.log(err);
  }
};

onMounted(() => {
  fetchData();
});

// format tiền
const formatVND = (price) => {
  return price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
};

// hàm tính tổng tiền bao gồm mã giảm giá
const total = (item) => {
  let sum = 0;
  item.cart.forEach((i) => {
    sum += i.price * i.quantity;
  });
  // Kiểm tra nếu đơn hàng có mã giảm giá và áp dụng phần trăm giảm giá
  if (item.sale) {
    const sale = sales.value.find(
      (sale) => sale.name === item.sale && sale.status
    );
    if (sale) {
      sum = sum - (sum * sale.down) / 100;
    }
  }
  return sum;
};
</script>

<style></style>
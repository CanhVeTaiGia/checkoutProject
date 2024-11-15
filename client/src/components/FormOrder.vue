<template>
  <div class="fixed inset-0 bg-gray-950 bg-opacity-50 flex justify-center items-start p-6">
    <div class="w-full max-w-5xl bg-white p-8 rounded-lg shadow-lg overflow-y-auto">
      <!-- Header đơn hàng -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-semibold">Thông tin đơn hàng</h1>
        <button @click="closeForm" class="text-blue-500 hover:text-blue-700 transition-colors">
          Trở về
        </button>
      </div>

      <!-- Thông tin đơn hàng -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div><strong>Mã đơn hàng:</strong> {{ props.new.id }}</div>
        <div><strong>Tổng tiền (cả ship):</strong> {{ formatVND(total(props.new) + props.new.ship) }}</div>
        <div><strong>Tên người nhận:</strong> {{ props.new.name }}</div>
        <div><strong>Số điện thoại:</strong> {{ props.new.phone }}</div>
        <div><strong>Địa chỉ:</strong> {{ props.new.address }}</div>
        <div><strong>Ghi chú:</strong> {{ props.new.note }}</div>
        <div>
          <strong>Trạng thái:</strong>
          <select v-model="statusOrder" class="border border-gray-300 p-2 rounded w-full md:w-auto" :disabled="props.new.status === 'daGui'">
            <option value="choDuyet" :disabled="props.new.status === 'daDuyet'">Chờ duyệt</option>
            <option value="daDuyet">Đã duyệt</option>
            <option value="daGui">Đã gửi</option>
          </select>
        </div>
        <div><strong>Thời gian đặt hàng:</strong> {{ props.new.created_at }}</div>
        <div>
          <strong>Phương thức thanh toán:</strong>
          {{ props.new.payTo === 'NhanHang' ? 'Trả tiền khi nhận hàng' : 'Chuyển khoản' }}
        </div>
        <div><strong>Mã giảm giá:</strong> {{ props.new.sale }}</div>
      </div>

      <button @click="handleStatus(props.new)" v-if="props.new.status !== 'daGui'" class="bg-blue-500 text-white px-4 py-2 rounded mt-5 hover:bg-blue-600 transition">
        Cập nhật trạng thái
      </button>

      <!-- Danh sách sản phẩm -->
      <table class="w-full mt-8 border-collapse">
        <thead class="bg-gray-100">
          <tr>
            <th class="border px-4 py-2">STT</th>
            <th class="border px-4 py-2">Ảnh</th>
            <th class="border px-4 py-2">Tên sản phẩm</th>
            <th class="border px-4 py-2">Số lượng</th>
            <th class="border px-4 py-2">Giá</th>
            <th class="border px-4 py-2">Tổng</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in props.new.cart" :key="item.id" class="border-t">
            <td class="border px-4 py-2 text-center">{{ index + 1 }}</td>
            <td class="border px-4 py-2">
              <img :src="item.image" alt="Product Image" class="w-16 h-16 object-cover mx-auto rounded" />
            </td>
            <td class="border px-4 py-2">{{ item.name }}</td>
            <td class="border px-4 py-2 text-center">{{ item.quantity }}</td>
            <td class="border px-4 py-2">{{ formatVND(item.price) }}</td>
            <td class="border px-4 py-2">{{ formatVND(item.price * item.quantity) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import apiClient from "@/api/instance";
import { useStore } from "vuex";

const props = defineProps(["new"]);
const emit = defineEmits(["onClose"]);
const store = useStore();

const statusOrder = ref(props.new.status);
const sales = ref([]);

// Đóng form chi tiết đơn hàng
const closeForm = () => {
  emit("onClose");
};

// Định dạng tiền Việt Nam Đồng
const formatVND = (price) => {
  return price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
};

// Tính tổng tiền đơn hàng
const total = (item) => {
  let sum = 0;
  item.cart.forEach((i) => {
    sum += i.price * i.quantity;
  });

  if (item.sale) {
    const sale = sales.value.find((sale) => sale.name === item.sale && sale.status);
    if (sale) {
      sum -= (sum * sale.down) / 100;
    }
  }
  return sum;
};

// Xử lý cập nhật trạng thái đơn hàng
const handleStatus = () => {
  props.new.status = statusOrder.value;
  store.dispatch("apiEditOrder", props.new);
  emit("onClose");
};

// Lấy dữ liệu mã giảm giá
const fetchData = async () => {
  try {
    const response = await apiClient.get("sales");
    sales.value = response.data;
  } catch (err) {
    console.error("Error fetching sales data:", err);
  }
};

onMounted(fetchData);
</script>

<style scoped>
/* Thêm CSS tuỳ chỉnh nếu cần */
</style>

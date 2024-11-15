<template>
  <div>
    <Header />
    <div class="shipping-form flex justify-center items-start p-5 w-full mt-20 bg-gray-100">
      <!-- Phần thanh toán -->
      <div class="shipping-form-child w-full lg:w-[40%] bg-white rounded-lg shadow-lg p-6">
        <h1 class="text-2xl font-bold mb-4">Thanh toán</h1>
        <h3 class="text-lg font-semibold mb-4">Thông tin giao hàng</h3>
        <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
          <div class="bg-white p-6 rounded-md border border-gray-200 shadow-sm">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-semibold">Địa chỉ của tôi</h2>
              <button type="button" @click.prevent.stop="handleShow" class="text-blue-600 hover:text-blue-700 font-medium">
                + Thêm địa chỉ mới
              </button>
            </div>
            <div v-for="item in user?.contact" :key="item.id" class="address-item border p-4 rounded-lg mb-4 shadow-md">
              <div class="flex items-center justify-between">
                <div>
                  <input type="radio" v-model="selectedAddressId" :value="item.id" />
                  <label class="font-medium text-lg">{{ item.name }}</label>
                  <p class="text-gray-500">{{ item.phone }}</p>
                  <p class="text-gray-600">{{ item.address }}, {{ item.commune }}, {{ item.district }}, {{ item.city }}</p>
                </div>
                <div class="flex gap-2">
                  <button type="button" @click.prevent.stop="handleSave(item.id)" class="text-blue-500 hover:text-blue-600">
                    <i class="fa-regular fa-floppy-disk"></i>
                  </button>
                  <button type="button" @click.prevent.stop="handleDelete(item.id)" class="text-red-500 hover:text-red-600">
                    <i class="fa-solid fa-x"></i>
                  </button>
                </div>
              </div>
            </div>
            <div v-if="!error2 && !user?.contact?.length" class="text-black mt-4">
              Bạn chưa có địa chỉ nào.
            </div>
            <div v-if="error2" class="text-red-500 text-sm">
              Vui lòng thêm địa chỉ rồi mới thanh toán
            </div>
          </div>
          <div v-if="error4" class="text-green-500 text-sm flex justify-center mt-[-35px] mb-2">Đã đặt địa chỉ thành mặc định</div>
          <select v-model="payTo" class="select w-full p-3 border border-gray-300 rounded-lg">
            <option value="">Chọn phương thức thanh toán</option>
            <option value="NhanHang">Trả tiền khi nhận hàng</option>
            <option value="ChuyenKhoan">Chuyển khoản</option>
          </select>
          <div v-if="error" class="text-red-500 text-sm">
            Vui lòng chọn phương thức thanh toán
          </div>

          <div class="border-b pb-4 mb-4">
            <div class="flex justify-between items-center">
              <input v-model="salesInput" type="text" class="w-400 border border-gray-300 rounded-lg p-2" placeholder="Mã giảm giá">
              <button type="button" @click.prevent.stop="applySales" class="mr-60 bg-green-500 text-white rounded-lg p-2 hover:bg-gray-600">
                Sử dụng
              </button>
            </div>
            <div v-if="error3" class="text-red-500 text-sm mt-2">Mã giảm giá không đúng!</div>
            <div v-if="discount > 0" class="text-green-500 text-sm mt-2">Đã áp dụng giảm giá: {{ discount }}%</div>
          </div>

          <button v-if="user?.cart?.length != 0" type="submit" class="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Thanh toán
          </button>
          <button v-if="user?.cart?.length == 0" class="w-full p-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500" @click="nextHome">
            Quay lại để mua hàng
          </button>

          <!-- Modal thông báo đặt hàng thành công -->
          <div v-if="showMenu" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg p-6 shadow-lg text-center w-[90%] md:w-[400px]">
              <div class="flex items-center justify-center mb-4">
                <i class="fa-solid fa-check-circle text-green-500 text-5xl"></i>
              </div>
              <h2 class="text-xl font-bold mb-2">Đặt hàng thành công!</h2>
              <p class="text-gray-600 mb-4">Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ xử lý đơn hàng của bạn ngay lập tức.</p>
              <button @click="showMenu = false" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                Đóng
              </button>
            </div>
          </div>
        </form>
      </div>

      <!-- Phần hiển thị tóm tắt giỏ hàng -->
      <div class="shipping-form-2 w-full lg:w-[30%] h-screen border-l border-gray-300 pl-6">
        <div class="cart-summary bg-white p-6 rounded-lg shadow-md">
          <div v-for="item in user?.cart" :key="item.id" class="item flex justify-between items-center mb-4">
            <img :src="item.image" class="w-16 h-16 rounded shadow" />
            <div class="bg-gray-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">{{ item.quantity }}</div>
            <span class="w-40 truncate">{{ item.name }}</span>
            <span class="text-lg font-bold">{{ formatVND(item.price) }}</span>
          </div>

          <div class="total flex justify-between border-t border-gray-200 pt-2 mt-2">
            <span>Tạm tính</span>
            <span class="font-bold">{{ user?.cart?.length ? formatVND(calculateTotalPrice()) : '0 VND' }}</span>
          </div>
          <div class="shipping-fee flex items-center justify-between mt-2">
            <label for="shipping" class="text-sm font-semibold">Phí vận chuyển</label>
            <select v-model="shippingFee" id="shipping" class="w-70 border border-gray-300 rounded-lg p-2 text-gray-700">
              <option :value="20000">Giao hàng chậm - 20,000 VND</option>
              <option :value="50000">Giao hàng nhanh - 50,000 VND</option>
            </select>
          </div>
          <div class="grand-total flex justify-between mt-4 border-t border-gray-300 pt-3">
            <b>Tổng cộng</b>
            <span class="text-red-600 text-xl font-bold">{{ user?.cart?.length ? formatVND(calculateGrandTotal()) : '0 VND' }}</span>
          </div>
        </div>
      </div>
    </div>
    <Model v-if="show" @close="closeForm"></Model>
    <Contact />
    <Footer />
    <Delete v-if="showDelete" @close="handleCloseDelete" @deleteConfirm="handleDeleteConfirm"></Delete>
  </div>
</template>

<script setup>
import Footer from "@/components/Footer.vue";
import Header from "@/components/Header.vue";
import Delete from "@/components/Delete.vue";
import { ref, reactive, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import apiClient from "@/api/instance";
import Model from "@/components/Model.vue";
import { useStore } from "vuex";

const error = ref(false);
const error2 = ref(false);
const error3 = ref(false);
const error4 = ref(false);
const show = ref(false);
const showDelete = ref(false);
const showMenu = ref(false); // Biến điều khiển modal thông báo
const payTo = ref("");
const router = useRouter();
const store = useStore();
const users = ref([]);
const user = ref({
  cart: [], // Khởi tạo cart là một mảng rỗng
});
const selectedAddressId = ref(null); // ID của địa chỉ được chọn

const salesInput = ref("");
const discount = ref(0); // Phần trăm giảm giá
const shippingFee = ref(20000); // Phí vận chuyển mặc định là 20,000 VND

const userLocal = JSON.parse(localStorage.getItem("userLogin") || "null");
const newOrder = reactive({
  id: Math.ceil(Math.random() * 9999999),
  name: "",
  phone: "",
  address: "",
  status: "choDuyet",
  cart: [],
  ship: 0,
  payTo: "",
  idUser: [],
  created_at: getCurrentDate(),
  sale: "", // Giá trị mã giảm giá
});

const sales = ref([]);
const products = ref([]);

// Hàm lấy ngày hiện tại
function getCurrentDate() {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();
  return `${day}/${month}/${year}`;
}

// Hàm lấy dữ liệu người dùng từ API
const fetchData = async () => {
  try {
    const response = await apiClient.get("users");
    const response2 = await apiClient.get("sales");
    const response3 = await apiClient.get("products");
    users.value = response.data;
    sales.value = response2.data;
    products.value = response3.data;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu người dùng:", error);
  }
};

// Hàm chọn địa chỉ mặc định
const handleSave = (id) => {
  error4.value = true;
  selectedAddressId.value = id;
  store.dispatch('apiEditCustomer', user.value)
    .then(() => {
      fetchData(); // Cập nhật dữ liệu sau khi lưu địa chỉ
    })
    .catch((error) => console.error("Lỗi khi cập nhật dữ liệu người dùng:", error));
  setTimeout(() => {
    error4.value = false;
  }, 2000);
};

// Cập nhật thông tin người dùng khi dữ liệu thay đổi
watch(users, (newUsers) => {
  if (newUsers.length > 0) {
    user.value = newUsers.find((item) => item.id === userLocal.id) || {
      cart: [],
    };
  }
});

// Hàm định dạng tiền tệ
const formatVND = (price) => {
  if (price) {
    return price.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  }
};

// Hàm tính tổng tiền giỏ hàng
const calculateTotalPrice = () => {
  if (user.value && user.value.cart) {
    let total = user.value.cart.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    // Áp dụng giảm giá nếu có
    if (discount.value > 0) {
      total = total - (total * discount.value) / 100;
    }

    return total;
  }
  return 0;
};

// Tính tổng cộng bao gồm ship
const calculateGrandTotal = () => {
  const totalPrice = calculateTotalPrice();
  return totalPrice + shippingFee.value;
};

// Áp dụng mã giảm giá
const applySales = () => {
  const foundSale = sales.value.find(
    (sale) => sale.name === salesInput.value && sale.status
  );
  if (foundSale) {
    discount.value = foundSale.down;
    error3.value = false;
    newOrder.sale = salesInput.value; // Lưu mã giảm giá vào đơn hàng
  } else {
    discount.value = 0;
    error3.value = true;
    setTimeout(() => {
      error3.value = false;
    }, 3000);
    newOrder.sale = "";
  }
};

onMounted(() => {
  fetchData();
});

// Hàm mở form thêm địa chỉ
const handleShow = () => {
  show.value = true;
};

// Hàm đóng form và refresh lại dữ liệu
const closeForm = () => {
  show.value = false;
  fetchData();
};

// Hàm xử lý thanh toán
const handleSubmit = async () => {
  error3.value = false;
  if (user.value.contact && user.value.contact.length > 0) {
    error2.value = false;
    if (payTo.value === "") {
      error.value = true;
      setTimeout(() => {
        error.value = false;
      }, 2000);
    } else {
      error.value = false;
      const selectedContact = user.value.contact.find(item => item.id === selectedAddressId.value);
      if (selectedContact) {
        newOrder.name = selectedContact.name || "";
        newOrder.phone = selectedContact.phone || "";
        newOrder.address = `${selectedContact.address}, ${selectedContact.commune}, ${selectedContact.district}, ${selectedContact.city}` || "";
        newOrder.payTo = payTo.value;
        newOrder.cart = user.value.cart;
        newOrder.idUser = user.value.id;
        newOrder.ship = shippingFee.value;

        // Giảm stock và tăng sales cho từng sản phẩm
        newOrder.cart.forEach((cartItem) => {
          const product = products.value.find((p) => p.id === cartItem.id);
          if (product) {
            product.stock -= cartItem.quantity;
            product.sales += cartItem.quantity;

            store
              .dispatch("apiEditProduct", product)
              .then(() => {
                console.log(`Đã cập nhật sản phẩm: ${product.name}`);
              })
              .catch((error) => {
                console.error(`Lỗi khi cập nhật sản phẩm: ${product.name}`, error);
              });
          }
        });
        user.value.cart = [];
        store.dispatch("apiEditCustomer", user.value);
        store
          .dispatch("apiAddOrder", newOrder)
          .then(() => {
            showMenu.value = true;
            setTimeout(() => {
              showMenu.value = false;
              router.push("/");
            }, 3000);
          })
          .catch((error) => {
            console.error("Lỗi khi tạo đơn hàng:", error);
          });
      } else {
        console.error("Vui lòng chọn một địa chỉ giao hàng.");
      }
    }
  } else {
    error2.value = true;
    setTimeout(() => {
      error2.value = false;
    }, 2000);
  }
};

const IdDelete = ref(null);
const handleDelete = (id) => {
  IdDelete.value = id;
  showDelete.value = true;
};

const handleCloseDelete = () => {
  showDelete.value = false;
};

// Hàm xóa địa chỉ
const handleDeleteConfirm = () => {
  if (user.value.contact[user.value.save]?.id === IdDelete.value) {
    user.value.save = 0;
  }
  user.value.contact = user.value.contact.filter(item => item.id !== IdDelete.value);
  store.dispatch('apiEditCustomer', user.value)
    .then(() => {
      fetchData();
      showDelete.value = false;
    })
    .catch((error) => console.error("Lỗi khi cập nhật dữ liệu người dùng:", error));
};
</script>

<style scoped>
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.5s;
}
.modal-enter, .modal-leave-to {
  opacity: 0;
}
</style>

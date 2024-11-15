<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-all duration-500">
    <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 max-w-lg w-full transition-all duration-500">
      <div class="mb-8 text-center">
        <h2 class="text-3xl font-bold text-gray-800 dark:text-white mb-4">Create Account</h2>
        <p class="text-gray-600 dark:text-gray-400">Tạo tài khoản của bạn</p>
      </div>
      <form @submit.prevent="addUser">
        <div class="mb-4">
          <input
            v-model="newUser.name"
            type="text"
            placeholder="Tên đăng nhập"
            class="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring focus:ring-blue-300"
          />
          <div v-if="err.noName" class="text-red-500 text-xs mt-1">Tên đăng nhập không được để trống</div>
        </div>
        <div class="mb-4">
          <input
            v-model="newUser.email"
            type="email"
            placeholder="Email"
            class="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring focus:ring-blue-300"
          />
          <div v-if="err.noEmail" class="text-red-500 text-xs mt-1">Email không được để trống</div>
          <div v-if="err.sameEmail" class="text-red-500 text-xs mt-1">Email không hợp lệ hoặc đã tồn tại</div>
        </div>
        <div class="mb-4">
          <input
            v-model="newUser.password"
            type="password"
            placeholder="Mật khẩu"
            class="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring focus:ring-blue-300"
          />
          <div v-if="err.noPassword" class="text-red-500 text-xs mt-1">Mật khẩu không được để trống</div>
          <div v-if="err.passwordTooShort" class="text-red-500 text-xs mt-1">Mật khẩu phải có ít nhất 6 ký tự</div>
        </div>
        <div class="mb-4">
          <input
            v-model="confirmPassword"
            type="password"
            placeholder="Nhập lại mật khẩu"
            class="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring focus:ring-blue-300"
          />
          <div v-if="err.passwordMismatch" class="text-red-500 text-xs mt-1">Mật khẩu không trùng</div>
        </div>
        <div class="mb-4">
          <input
            v-model="newUser.phone"
            type="text"
            placeholder="Số điện thoại"
            class="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring focus:ring-blue-300"
          />
          <div v-if="err.phone" class="text-red-500 text-xs mt-1">Số điện thoại không hợp lệ</div>
        </div>
        <button
          type="submit"
          class="w-full py-3 mt-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
        >
          Đăng ký
        </button>
      </form>
      <div class="mt-6 text-center">
        <a @click="toLogin" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
          Bạn đã có tài khoản?
        </a>
      </div>

      <!-- Modal thông báo thành công -->
      <div v-if="showSuccessModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg max-w-sm w-full text-center">
          <h3 class="text-2xl font-bold text-green-500">Đăng ký thành công!</h3>
          <p class="mt-2 text-gray-700 dark:text-gray-400">Bạn sẽ được chuyển hướng đến trang đăng nhập sau 3 giây.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import apiClient from "@/api/instance";
import { onMounted, ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const store = useStore();
const router = useRouter();
const users = ref([]);

// Tải dữ liệu người dùng
const fetchData = async () => {
  const response = await apiClient.get('users');
  users.value = response.data;
};

onMounted(() => {
  fetchData();
});

// Chuyển hướng đến trang đăng nhập
const toLogin = () => {
  router.push("/login");
};

// Lấy ngày hiện tại
const getCurrentDate = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();
  return `${day}/${month}/${year}`;
};

// Biến lưu trữ thông tin lỗi
const err = reactive({
  noName: false,
  noEmail: false,
  sameEmail: false,
  noPassword: false,
  passwordTooShort: false,
  passwordMismatch: false,
  phone: false,
});

// Biến lưu mật khẩu nhập lại
const confirmPassword = ref("");

// Biến điều khiển hiển thị modal thông báo thành công
const showSuccessModal = ref(false);

// Hàm kiểm tra email hợp lệ
const validateEmail = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i;
  return re.test(email.toLowerCase());
};

// Thêm người dùng
const addUser = () => {
  // Reset tất cả các lỗi trước khi kiểm tra lại
  Object.keys(err).forEach(key => err[key] = false);

  // Kiểm tra tên đăng nhập
  if (newUser.name === "") {
    err.noName = true;
    setTimeout(() => err.noName = false, 3000);
    return;
  }

  // Kiểm tra email
  if (newUser.email === "") {
    err.noEmail = true;
    setTimeout(() => err.noEmail = false, 3000);
    return;
  } else if (!validateEmail(newUser.email)) {
    err.sameEmail = true;
    setTimeout(() => err.sameEmail = false, 3000);
    return;
  } else if (users.value.some((user) => user.email === newUser.email)) {
    err.sameEmail = true;
    setTimeout(() => err.sameEmail = false, 3000);
    return;
  }

  // Kiểm tra mật khẩu
  if (newUser.password === "") {
    err.noPassword = true;
    setTimeout(() => err.noPassword = false, 3000);
    return;
  } else if (newUser.password.length < 6) {
    err.passwordTooShort = true;
    setTimeout(() => err.passwordTooShort = false, 3000);
    return;
  }

  // Kiểm tra mật khẩu nhập lại có khớp không
  if (newUser.password !== confirmPassword.value) {
    err.passwordMismatch = true;
    setTimeout(() => err.passwordMismatch = false, 3000);
    return;
  }

  // Kiểm tra số điện thoại
  if (!/^0\d{9}$/.test(newUser.phone)) {
    err.phone = true;
    setTimeout(() => err.phone = false, 3000);
    return;
  }

  // Nếu không có lỗi, tiếp tục đăng ký
  newUser.created_at = getCurrentDate();
  store.dispatch('apiAddCustomer', newUser);

  // Hiển thị modal thông báo thành công
  showSuccessModal.value = true;

  // Chuyển hướng đến trang đăng nhập sau 3 giây
  setTimeout(() => {
    showSuccessModal.value = false; // Ẩn modal
    router.push("/login"); // Chuyển hướng
  }, 3000);
};

// Biến lưu thông tin người dùng
const newUser = reactive({
  id: Math.ceil(Math.random() * 9999999),
  name: "",
  email: "",
  status: true,
  password: "",
  role: false,
  avatar: "https://static.vecteezy.com/system/resources/thumbnails/002/318/271/small_2x/user-profile-icon-free-vector.jpg",
  phone: "",
  address: "",
  created_at: getCurrentDate(),
  cart: [],
  like: [],
  contact: [],
  save: 0
});
</script>

<style scoped>
body {
  font-family: 'Raleway', sans-serif;
}

/* Custom CSS for Register Card */
.bg-gray-100 {
  transition: background-color 0.5s ease;
}
.bg-white {
  transition: background-color 0.5s ease;
}

.dark\:bg-gray-900 {
  background-color: #1a202c;
}

.dark\:bg-gray-800 {
  background-color: #2d3748;
}

.rounded-3xl {
  border-radius: 1.5rem;
}

.shadow-xl {
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.1);
}

/* Input Focus Effect */
input:focus {
  border-color: #63b3ed;
  box-shadow: 0 0 5px #63b3ed;
}

/* Transition */
.transition-all {
  transition: all 0.5s ease-in-out;
}

/* Modal CSS */
.fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.bg-opacity-50 {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>

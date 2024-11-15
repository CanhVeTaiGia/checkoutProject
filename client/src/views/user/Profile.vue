<template>
  <div>
    <div class="profile-container mx-auto mt-12 p-6 bg-white border border-gray-300 rounded-lg max-w-lg">
      <div class="profile-container-out flex justify-between mb-4">
        <h1 class="text-3xl font-bold">Hồ Sơ Của Tôi</h1>
        <div class="profile-container-out-icon cursor-pointer">
          <i @click="nextHome" class="fa-solid fa-x hover:text-red-500"></i>
        </div>
      </div>
      <p class="mb-6 text-gray-600">
        Quản lý thông tin hồ sơ để bảo mật tài khoản
      </p>

      <div v-if="user" class="form-group flex flex-col mb-4">
        <label for="name" class="text-sm font-semibold">Tên</label>
        <input
          type="text"
          id="name"
          v-model="ChangeUser.name"
          class="w-full p-3 border border-gray-300 rounded-md h-10"
        />
      </div>

      <div class="form-group flex flex-col mb-4">
        <label for="phone" class="text-sm font-semibold">Số điện thoại</label>
        <input
          type="text"
          id="phone"
          v-model="ChangeUser.phone"
          class="w-full p-3 border border-gray-300 rounded-md h-10"
        />
      </div>

      <div class="col-span-1">
        <label for="image" class="block text-sm font-medium">Ảnh đại diện</label>
        <input class="mt-1 p-2 border rounded w-full" type="file" @change="handleFileChange" />
        <div class="flex justify-center text-center">
          <img :src="previewImage || ChangeUser.avatar" class="w-16 h-16 mt-4 object-cover" />
        </div>
      </div>

      <div class="form-group flex flex-col mb-4">
        <label for="oldPassword" class="text-sm font-semibold">Mật khẩu cũ</label>
        <input
          type="password"
          id="oldPassword"
          v-model="oldPassword"
          class="w-full p-3 border border-gray-300 rounded-md h-10"
          placeholder="Nhập mật khẩu cũ"
        />
        <div v-if="passwordErr" class="text-red-500 text-xs mt-1">Mật khẩu cũ không đúng</div>
      </div>

      <div class="form-group flex flex-col mb-4">
        <label for="newPassword" class="text-sm font-semibold">Mật khẩu mới</label>
        <input
          type="password"
          id="newPassword"
          v-model="newPassword"
          class="w-full p-3 border border-gray-300 rounded-md h-10"
          placeholder="Nhập mật khẩu mới"
        />
        <div v-if="passwordTooShort" class="text-red-500 text-xs mt-1">Mật khẩu phải có ít nhất 6 ký tự</div>
        <div v-if="passwordErr2" class="text-red-500 text-xs mt-1">Mật khẩu không được để trống</div>
      </div>
      
      <button
        @click="handleSubmit"
        class="save-button w-full py-3 bg-sky-500 text-white rounded-md hover:bg-orange-600 transition-colors duration-300 flex items-center justify-center h-10"
      >
        Lưu
      </button>

      <div v-if="showMenu" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 shadow-lg text-center w-[90%] md:w-[400px]">
          <div class="flex items-center justify-center mb-4">
            <i class="fa-solid fa-check-circle text-green-500 text-5xl"></i>
          </div>
          <h2 class="text-xl font-bold mb-2">Thay đổi thông tin thành công</h2>
          <button @click="showMenu = false" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            Đóng
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, reactive } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '@/api/instance';
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import { storage } from "@/firebase";
import { useStore } from 'vuex';

const store = useStore();
const router = useRouter();
const users = ref([]);
const newPassword = ref('');
const oldPassword = ref('');
const passwordTooShort = ref(false);
const passwordErr = ref(false);
const passwordErr2 = ref(false);
const file = ref(null);
const previewImage = ref('');
const showMenu = ref(false);
const user = ref(null);
const userLocal = JSON.parse(localStorage.getItem('userLogin') || 'null');
const ChangeUser = reactive({
  id: '',
  name: '',
  email: '',
  status: '',
  password: '',
  role: '',
  avatar: '',
  phone: '',
  created_at: '',
  cart: [],
  like: [],
  contact: [],
  save: []
});

const fetchData = async () => {
  try {
    const response = await apiClient.get('users');
    users.value = response.data;
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu người dùng:', error);
  }
};

watch(users, (newUsers) => {
  if (newUsers.length > 0) {
    user.value = newUsers.find(item => item.id === userLocal.id);
    if (user.value) {
      ChangeUser.id = user.value.id;
      ChangeUser.name = user.value.name;
      ChangeUser.gmail = user.value.email;
      ChangeUser.status = user.value.status;
      ChangeUser.password = user.value.password;
      ChangeUser.role = user.value.role;
      ChangeUser.avatar = user.value.avatar;
      ChangeUser.phone = user.value.phone;
      ChangeUser.created_at = user.value.created_at;
      ChangeUser.cart = user.value.cart;
      ChangeUser.like = user.value.like;
      ChangeUser.contact = user.value.contact;
      ChangeUser.save = user.value.save;
    }
  }
});

onMounted(() => {
  fetchData();
});

const nextHome = () => {
  router.push('/');
};

const handleFileChange = (event) => {
  file.value = event.target.files[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    previewImage.value = e.target.result;
  };
  reader.readAsDataURL(file.value);
};

const handleSubmit = async () => {
  try {
    if (file.value) {
      const storageReference = storageRef(storage, `avatars/${file.value.name}`);
      await uploadBytes(storageReference, file.value);
      const urlDownload = await getDownloadURL(storageReference);
      ChangeUser.avatar = urlDownload;
    }

    if (oldPassword.value) {
      if (oldPassword.value !== user.value.password) {
        passwordErr.value = true;
        return;
      } else {
        passwordErr.value = false;
      }

      if (!newPassword.value) {
        passwordErr2.value = true;
        return;
      } else {
        passwordErr2.value = false;
      }

      if (newPassword.value.length < 6) {
        passwordTooShort.value = true;
        return;
      } else {
        passwordTooShort.value = false;
      }

      ChangeUser.password = newPassword.value;
    }

    // Giữ lại giá trị `gmail` nếu không thay đổi
    ChangeUser.gmail = ChangeUser.gmail || user.value.gmail;

    // Cập nhật thông tin tên và số điện thoại
    ChangeUser.name = ChangeUser.name || user.value.name;
    ChangeUser.phone = ChangeUser.phone || user.value.phone;

    store.dispatch('apiEditCustomer', ChangeUser);

    showMenu.value = true;

    setTimeout(() => {
      showMenu.value = false;
    }, 3000);
    
  } catch (error) {
    console.error('Lỗi khi cập nhật thông tin người dùng:', error);
    alert('Có lỗi xảy ra khi cập nhật thông tin.');
  }
};
</script>

<style scoped>
.fixed {
  transition: opacity 0.3s ease;
}
</style>

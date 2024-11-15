<template>
  <div
    class="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-all duration-500"
  >
    <div
      class="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8 max-w-md w-full transition-all duration-500"
    >
      <div class="mb-8 text-center">
        <h2 class="text-3xl font-bold text-gray-800 dark:text-white mb-4">
          Login Account
        </h2>
        <p class="text-gray-600 dark:text-gray-400">
          Đăng nhập tài khoản của bạn
        </p>
      </div>
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <input
            type="email"
            v-model="userInfo.email"
            placeholder="Email"
            class="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <div class="mb-4">
          <input
            type="password"
            v-model="userInfo.password"
            placeholder="Password"
            class="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <div v-if="error.passwordShort" class="text-red-500 text-sm mb-4">
          Mật khẩu phải có ít nhất 6 ký tự
        </div>
        <div v-if="error.password" class="text-red-500 text-sm mb-4">
          Tài khoản hoặc mật khẩu không chính xác
        </div>
        <div v-if="error.null" class="text-red-500 text-sm mb-4">
          Tài khoản và mật khẩu không được để trống
        </div>
        <div v-if="error.block" class="text-red-500 text-sm mb-4">
          Tài khoản đã bị chặn, vui lòng dùng tài khoản khác!
        </div>
        <button
          type="submit"
          class="w-full py-3 mt-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
        >
          Đăng nhập
        </button>
      </form>
      <div class="mt-6 text-center">
        <a
          @click="toRegistere"
          class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
        >
          Bạn chưa có tài khoản?
        </a>
      </div>
    </div>

    <!-- Modal thông báo đăng nhập thành công -->
    <div
      v-if="modalSuccess"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg max-w-sm w-full text-center"
      >
        <h3 class="text-2xl font-bold text-green-500 mb-4">Đăng nhập thành công</h3>
      </div>
    </div>
  </div>
</template>

<script setup>
import apiClient from "@/api/instance";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";

const error = reactive({
  null: false,
  password: false,
  block: false,
  passwordShort: false,
});
const userInfo = reactive({
  email: "",
  password: "",
});
const router = useRouter();
const modalSuccess = ref(false);

const toRegistere = () => {
  router.push("/register");
};

const handleLogin = async () => {
  try {
    const response = await apiClient.get("users");
    const listUser = response.data;
    if (userInfo.email === "" || userInfo.password === "") {
      error.null = true;
      setTimeout(() => {
        error.null = false;
      }, 2000);
    } else {
      error.null = false;
      const userLogin = listUser.find((item) => {
        return (
          item.email === userInfo.email && item.password === userInfo.password
        );
      });

      if (!userLogin) {
        error.password = true;
        setTimeout(() => {
          error.password = false;
        }, 2000);
      } else {
        error.password = false;

        if (userLogin.role) {
          modalSuccess.value = true;
          setTimeout(() => {
            localStorage.setItem("userLogin", JSON.stringify(userLogin));
            modalSuccess.value = false;
            router.push("/admin");
          }, 2000);
        } else {
          if (userLogin.status) {
            modalSuccess.value = true;
            setTimeout(() => {
              localStorage.setItem("userLogin", JSON.stringify(userLogin));
              modalSuccess.value = false;
              router.push("/home");
            }, 2000);
          } else {
            error.block = true;
            setTimeout(() => {
              error.block = false;
            }, 3000);
          }
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};
</script>

<style scoped>
body {
  font-family: "Raleway", sans-serif;
}

/* Custom CSS for Login Card */
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

.shadow-lg {
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

/* Input Focus Effect */
input:focus {
  border-color: #63b3ed;
  box-shadow: 0 0 5px #63b3ed;
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

/* Transition */
.transition-all {
  transition: all 0.5s ease-in-out;
}
</style>

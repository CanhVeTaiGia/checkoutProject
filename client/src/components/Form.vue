<template>
  <div>
    <div class="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
      <div class="bg-white p-8 rounded-lg w-full max-w-3xl shadow-lg">
        <button @click="closeForm" class="text-blue-500 mb-4 hover:text-blue-700 transition duration-300">
          Back
        </button>
        <h2 class="text-2xl font-bold mb-4 text-gray-800">
          {{ props.act == "add" ? "Thêm sản phẩm" : "Sửa sản phẩm" }}
        </h2>
        <form @submit.prevent="addProduct" class="grid grid-cols-2 gap-4">
          <!-- Tên sản phẩm -->
          <div class="col-span-1">
            <label htmlFor="name" class="block text-sm font-medium text-gray-700">Tên sản phẩm</label>
            <input :ref="firstInput" v-model="newProduct.name" type="text" class="mt-1 p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <div v-if="err.sameName" class="text-red-500 text-xs mt-1">
              Tên sản phẩm không được trùng
            </div>
            <div v-if="err.noName" class="text-red-500 text-xs mt-1">
              Tên sản phẩm không được để trống
            </div>
          </div>

          <!-- Số lượng sản phẩm -->
          <div class="col-span-1">
            <label htmlFor="stock" class="block text-sm font-medium text-gray-700">Số lượng</label>
            <input v-model="newProduct.stock" type="number" class="mt-1 p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <div v-if="err.noStock" class="text-red-500 text-xs mt-1">
              Số lượng không được nhỏ hơn 1
            </div>
          </div>

          <!-- Giá sản phẩm -->
          <div class="col-span-1">
            <label htmlFor="price" class="block text-sm font-medium text-gray-700">Giá</label>
            <input v-model="newProduct.price" type="number" class="mt-1 p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <div v-if="err.noPrice" class="text-red-500 text-xs mt-1">
              Giá không được nhỏ hơn 1
            </div>
          </div>

          <!-- Ảnh sản phẩm -->
          <div class="col-span-1">
            <label htmlFor="image" class="block text-sm font-medium text-gray-700">URL Ảnh</label>
            <input @change="handleUpFile" class="mt-1 p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500" type="file" />
            <div v-if="imageUrl || newProduct.image !== ''" class="flex justify-center text-center mt-4">
              <img :src="imageUrl || newProduct.image" class="w-16 h-16 mt-4 rounded-lg object-cover shadow-md" />
            </div>
            <div v-if="err.noImage" class="text-red-500 text-xs mt-1">
              Hình ảnh chưa được chọn
            </div>
          </div>

          <!-- Phân loại sản phẩm -->
          <div class="col-span-1">
            <label htmlFor="category" class="block text-sm font-medium text-gray-700">Phân loại</label>
            <select class="mt-1 p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500" v-model="newProduct.category">
              <option value="">Phân loại sản phẩm</option>
              <option v-for="item in category" :key="item.id" :value="item.name">
                {{ item.name }}
              </option>
            </select>
            <div v-if="err.noCategory" class="text-red-500 text-xs mt-1">
              Bắt buộc phải chọn danh mục cho sản phẩm
            </div>
          </div>

          <!-- Trạng thái sản phẩm -->
          <div class="col-span-1">
            <label htmlFor="status" class="block text-sm font-medium text-gray-700">Trạng thái</label>
            <select v-model="newProduct.status" class="mt-1 p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option :value="true">Đang bán</option>
              <option :value="false">Ngừng bán</option>
            </select>
          </div>

          <!-- Mô tả sản phẩm -->
          <div class="col-span-2">
            <label htmlFor="description" class="block text-sm font-medium text-gray-700">Chi tiết sản phẩm</label>
            <textarea v-model="newProduct.description" class="mt-1 p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500" rows="3" placeholder="Mô tả chi tiết sản phẩm"></textarea>
          </div>

          <!-- Nút thêm/sửa sản phẩm -->
          <div class="col-span-2">
            <button type="submit" class="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition duration-300">
              {{ props.act == "add" ? "Thêm sản phẩm" : "Sửa sản phẩm" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import apiClient from "@/api/instance";
import { nextTick, onMounted, reactive, ref } from "vue";
import { getDownloadURL, ref as storageRef, uploadBytes } from "firebase/storage";
import { storage } from "@/firebase";
import { useStore } from "vuex";
const store = useStore();

const err = reactive({
  noName: false,
  sameName: false,
  noPrice: false,
  noStock: false,
  noCategory: false,
  noImage: false,
});

const emit = defineEmits(["onClose"]);
const props = defineProps(["act", "item"]);

const closeForm = () => {
  emit("onClose");
};

const imageUrl = ref("");
const file = ref(null);

const handleUpFile = (e) => {
  imageUrl.value = URL.createObjectURL(e.target.files[0]);
  file.value = e.target.files[0];
};

const getCurrentDate = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();
  return `${day}/${month}/${year}`;
};

const newProduct = reactive({
  id: Math.ceil(Math.random() * 9999999),
  name: "",
  price: 0,
  stock: 0,
  category: "",
  status: true,
  image: "",
  description: "",
  created_at: getCurrentDate(),
  comments: [],
  sales: 0,
});

if (props.act == "edit") {
  newProduct.id = props.item.id;
  newProduct.name = props.item.name;
  newProduct.price = props.item.price;
  newProduct.stock = props.item.stock;
  newProduct.category = props.item.category;
  newProduct.status = props.item.status;
  newProduct.image = props.item.image;
  newProduct.description = props.item.description;
  newProduct.created_at = props.item.created_at;
  newProduct.comments = props.item.comments;
  newProduct.sales = props.item.sales;
}

const firstInput = ref(null);
const category = ref([]);
const products = ref([]);

const fetchData = async () => {
  const response = await apiClient("classify");
  const rpProducts = await apiClient("products");
  category.value = response.data;
  products.value = rpProducts.data;
};

onMounted(async () => {
  await fetchData();
  await nextTick();
  if (firstInput.value) {
    firstInput.value.focus();
  }
});

const addProduct = async () => {
  err.noName = false;
  err.sameName = false;
  err.noStock = false;
  err.noPrice = false;
  err.noCategory = false;
  err.noImage = false;

  if (newProduct.name === "") err.noName = true;

  if (props.act === "add") {
    if (products.value.some((item) => item.name === newProduct.name)) err.sameName = true;
  } else {
    if (products.value.some((item) => item.name === newProduct.name && item.id !== newProduct.id)) err.sameName = true;
  }

  if (newProduct.stock < 1) err.noStock = true;
  if (newProduct.price < 1) err.noPrice = true;
  if (!newProduct.category) err.noCategory = true;
  if (props.act === "add" && !file.value) err.noImage = true;

  if (err.noName || err.sameName || err.noStock || err.noPrice || err.noCategory || err.noImage) return;

  try {
    if (props.act === "add") {
      const storageReference = storageRef(storage, `images/${file.value.name}`);
      await uploadBytes(storageReference, file.value);
      const urlDownload = await getDownloadURL(storageReference);
      newProduct.image = urlDownload;
      store.dispatch("apiAddProduct", newProduct);
    } else if (props.act === "edit") {
      if (file.value) {
        const storageReference = storageRef(storage, `images/${file.value.name}`);
        await uploadBytes(storageReference, file.value);
        const urlDownload = await getDownloadURL(storageReference);
        newProduct.image = urlDownload;
      }
      store.dispatch("apiEditProduct", newProduct);
    }
    emit("onClose");
  } catch (error) {
    console.log(error);
  }
};
</script>

<style scoped>
/* No extra styles needed since we are using Tailwind for the design */
</style>

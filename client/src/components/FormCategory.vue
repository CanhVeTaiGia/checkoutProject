<template>
  <div>
    <div
      className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center"
    >
      <div className="bg-white p-8 rounded-lg w-full max-w-3xl">
        <button @click="onCLose" className="text-blue-500 mb-4">Back</button>
        <h2 className="text-2xl font-bold mb-4">
          {{ props.act === "edit" ? "Edit Category" : "Add Category" }}
        </h2>
        <form @submit.prevent="handleAdd" className="grid grid-cols-2 gap-4">
          <div className="col-span-1">
            <label htmlFor="name" className="block text-sm font-medium"
              >Tên danh mục</label
            >
            <input
              v-model="props.new.name"
              type="text"
              id="name"
              name="name"
              className="mt-1 p-2 border rounded w-full"
              required
            />
            <div v-if="ErrorName" className="text-red-500 text-xs mt-1">
              Tên danh mục không được phép trùng
            </div>
          </div>
          <div className="col-span-1">
            <label htmlFor="status" className="block text-sm font-medium"
              >Trạng thái</label
            >
            <select
              id="status"
              v-model="props.new.status"
              name="status"
              className="mt-1 p-2 border rounded w-full"
            >
              <option :value="true">Đang bán</option>
              <option :value="false">Ngừng bán</option>
            </select>
          </div>
          <div className="col-span-2">
            <label htmlFor="description" className="block text-sm font-medium"
              >Chi tiết</label
            >
            <textarea
              v-model="props.new.description"
              onChange="{handleChange}"
              className="mt-1 p-2 border rounded w-full"
              rows="{3}"
              placeholder="Mô tả danh mục"
            />
          </div>
          <div className="col-span-2">
            <button
              type="submit"
              className="w-full bg-purple-500 text-white py-2 rounded mt-4"
            >
              {{ props.act === "edit" ? "Sửa danh mục" : "Thêm danh mục" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import apiClient from "@/api/instance";
import { ref } from "vue";
import { useStore } from "vuex";

const props = defineProps(["new", "act"]);

const emit = defineEmits(["onCLose", "update"]);
const store = useStore();

const onCLose = () => {
  emit("onClose");
};

const ErrorName = ref(false);

const handleAdd = async () => {
  if (props.act == "add") {
    const response = await apiClient.get("classify");
    const listUser = response.data;
    // kiểm tra có trùng tên k
    const checkName = listUser.find((item) => item.name === props.new.name);
    if (!checkName) {
      ErrorName.value = false;
      store.dispatch("apiAddCategory", props.new);
      emit("onClose");
      emit("update");
    } else {
      ErrorName.value = true;
    }
  } else {
    store.dispatch("apiEditCategory", props.new);
    emit("onClose");
    emit("update");
  }
};
</script>

<style></style>

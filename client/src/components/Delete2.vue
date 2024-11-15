<template>
    <div class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 class="text-2xl font-semibold mb-4 text-gray-800">Xác nhận xóa tất cả</h2>
        <p class="text-gray-600">Bạn có chắc chắn muốn xóa tất cả sản phẩm?</p>
        <div class="flex justify-end gap-4 mt-6">
          <button @click="closeDeleteAll" class="px-4 py-2 bg-gray-400 text-white rounded-lg shadow hover:bg-gray-500 transition duration-300">
            Hủy
          </button>
          <button @click="deleteAll" class="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition duration-300">
            Xóa tất cả
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  const emit = defineEmits(['closeAll', 'deleteAllConfirm']);
  const deleteAll = () => {
    emit('deleteAllConfirm');
  };
  const closeDeleteAll = () => {
    emit('closeAll');
  };
  </script>
  
  <style scoped>
  /* No custom styles are needed since Tailwind is handling the design */
  </style>
  
<template>
    <div>
        <!-- form xác nhận cập nhập -->
        <div class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div class="bg-white p-6 rounded-lg">
                <h2 class="text-xl font-bold mb-4">Xác cập nhập trạng thái</h2>
                <p>Bạn có chắc chắn cập nhập trạng thái?</p>
                <div class="flex justify-end gap-4 mt-6">
                    <button @click="closeUpdate" class="px-4 py-2 bg-gray-500 text-white rounded">
                        Hủy
                    </button>
                    <button @click="updateCustomer" class="px-4 py-2 bg-red-500 text-white rounded">
                        Cập nhập
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const emit = defineEmits(['editConfirm','close'])

const updateCustomer=()=>{
    emit('editConfirm')
}
const closeUpdate=()=>{
    emit('close')
}
</script>

<style></style>
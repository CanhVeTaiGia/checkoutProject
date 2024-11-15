<template>
    <div class="bg-white p-6 rounded-md border shadow-sm min-h-[calc(100vh-170px)]">
        <div class="flex items-center justify-between">
            <h2 class="text-2xl font-semibold">Địa chỉ của tôi</h2>
            <a-button @click="showModal" type="primary">+ Thêm địa chỉ mới</a-button>
        </div>
        <div class="border-b my-5"></div>
        <div v-if="addresses.length > 0" class="space-y-4">
            <div v-for="address in addresses" :key="address.id"
                class="border flex flex-col gap-2 rounded-md p-4 relative">
                <div class="flex items-center gap-3">
                    <p class="font-medium text-[18px]">{{ address.fullName }}</p>
                    <div class="text-gray-500">|</div>
                    <p>{{ address.phone }}</p>
                </div>
                <p class="text-gray-700">{{ address.address }}</p>

                <div>
                    <a-button type="default">Mặc định</a-button>
                </div>

                <div class="absolute top-2 right-2 flex flex-col gap-2">
                    <div class="flex items-center gap-4 justify-end">
                        <button @click="editAddress(address.id)" class="text-blue-500 hover:text-blue-600">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-6-6l5 5M15.5 6.5a2.121 2.121 0 113 3L6 21l-3 0 0-3 15.5-15.5z" />
                            </svg>
                        </button>
                        <button @click="removeAddress(address.id)" class="text-red-500 hover:text-red-600">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                                fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clip-rule="evenodd" />
                            </svg>
                        </button>
                    </div>
                    <div>
                        <a-button type="default">Đặt làm mặc định</a-button>
                    </div>
                </div>
            </div>
        </div>
        <a-empty v-else description="Bạn chưa có địa chỉ nào" />
        <Model v-if="true"></Model>
    </div>
</template>

<script setup>
import axios from "axios";
import { onMounted, reactive, ref } from "vue";
import Model from '@/components/Model.vue'
// Danh sách địa chỉ
const addresses = ref([
    {
        id: 1,
        fullName: "Nguyễn Văn A",
        phone: "0123 456 789",
        address: "123 Đường ABC, Quận XYZ, TP. HCM",
    },
    {
        id: 2,
        fullName: "Trần Thị B",
        phone: "0987 654 321",
        address: "456 Đường DEF, Quận UVW, TP. Hà Nội",
    },
]);

const open = ref(false);
const listCity = ref([]);
const listDistrict = ref([]);
const listCommune = ref([]);

const form = reactive({
    fullName: "",
    phone: "",
    city: null,
    district: null,
    commune: null,
    specificAddress: "",
});

const showModal = () => {
    open.value = true;
};

const cancelModal = () => {
    open.value = false;
};

const handleOk = () => {
    // Handle submission logic
    console.log(form.value);
    open.value = false;
};

const fetchAllCity = async () => {
    const response = await axios.get("https://provinces.open-api.vn/api/p/");
    listCity.value = response.data;
};

const fetchDistricts = async (city) => {
    const selectedCity = listCity.value.find((item) => item.name === city);
    const response = await axios.get(
        `https://provinces.open-api.vn/api/p/${selectedCity.code}?depth=2`
    );
    listDistrict.value = response.data.districts;
};

const fetchCommunes = async (district) => {
    const selectedDistrict = listDistrict.value.find(
        (item) => item.name === district
    );
    const response = await axios.get(
        `https://provinces.open-api.vn/api/d/${selectedDistrict.code}?depth=2`
    );
    listCommune.value = response.data.wards;
};

onMounted(() => {
    fetchAllCity();
});
</script>
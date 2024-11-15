<template>
    <div class="modal-overlay">
        <div class="flex justify-center items-center w-[90%] max-w-2xl">
            <div class="shipping-newContact-child w-full p-6 bg-white rounded-lg shadow-lg">
                <div class="flex justify-between mb-4">
                    <h1 class="text-3xl font-bold text-gray-800">Thông tin nhận hàng</h1>
                    <i @click="handleClose" class="fa-solid fa-x cursor-pointer text-gray-500 hover:text-red-500 transition"></i>
                </div>
                <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
                    <input type="text" placeholder="Họ và tên" v-model="newContact.name"
                        class="input-field" />
                    <div v-if="err.noName" class="error-text">Vui lòng nhập tên người nhận hàng!</div>

                    <input type="tel" placeholder="Số điện thoại" v-model="newContact.phone"
                        class="input-field" />
                    <div v-if="err.noPhone" class="error-text">Vui lòng nhập số điện thoại!</div>
                    <div v-if="err.phoneErr" class="error-text">Số điện thoại phải bắt đầu bằng số 0 và có 10 chữ số!</div>

                    <select v-model="selectedCity" class="select-field">
                        <option value="">Chọn tỉnh / thành</option>
                        <option v-for="city in cities" :key="city.code" :value="city.code">{{ city.name }}</option>
                    </select>
                    <div v-if="err.noCity" class="error-text">Vui lòng chọn tỉnh / thành!</div>

                    <select v-model="selectedDistrict" class="select-field" :disabled="districts.length === 0">
                        <option value="">Chọn quận / huyện</option>
                        <option v-for="district in districts" :key="district.code" :value="district.code">{{ district.name }}</option>
                    </select>
                    <div v-if="err.noDistrict" class="error-text">Vui lòng chọn quận / huyện!</div>

                    <select v-model="selectedCommune" class="select-field" :disabled="communes.length === 0">
                        <option value="">Chọn phường / xã</option>
                        <option v-for="commune in communes" :key="commune.code" :value="commune.code">{{ commune.name }}</option>
                    </select>
                    <div v-if="err.noCommune" class="error-text">Vui lòng chọn phường / xã!</div>

                    <input type="text" placeholder="Địa chỉ" v-model="newContact.address" class="input-field" />
                    <div v-if="err.noAddress" class="error-text">Vui lòng nhập địa chỉ chi tiết, như số nhà, đường</div>

                    <button type="submit" class="submit-btn">
                        Thanh toán
                    </button>
                    <div v-if="err.someContact" class="error-text">Thông tin của bạn đã tồn tại, vui lòng thay đổi</div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue';
import axios from 'axios';
import apiClient from '@/api/instance';
import { useStore } from 'vuex';
const users = ref([]);
const user = ref(null);
const userLocal = JSON.parse(localStorage.getItem('userLogin') || 'null');
const store = useStore();
const emit = defineEmits(['close']);
const handleClose = () => {
    emit('close');
};

// Hàm lấy dữ liệu người dùng từ API
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
        console.log('user: ', user.value);
    }
});

// Các biến reactive và ref cho form và error
const cities = ref([]);
const districts = ref([]);
const communes = ref([]);
const selectedCity = ref('');
const selectedDistrict = ref('');
const selectedCommune = ref('');

const newContact = reactive({
    id: Math.ceil(Math.random() * 9999999),
    name: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    commune: '',
});

const err = reactive({
    noName: false,
    noPhone: false,
    phoneErr: false,
    noCity: false,
    noDistrict: false,
    noCommune: false,
    noAddress: false,
    someContact: false
});

const handleSubmit = () => {
    err.noName = !newContact.name;
    err.noPhone = !newContact.phone;
    if (!err.noPhone) {
        err.phoneErr = !/^0[0-9]{9}$/.test(newContact.phone);
    } else {
        err.phoneErr = false;
    }
    err.noCity = !selectedCity.value;
    err.noDistrict = !selectedDistrict.value;
    err.noCommune = !selectedCommune.value;
    err.noAddress = !newContact.address;

    if (!err.noName && !err.noPhone && !err.phoneErr && !err.noCity && !err.noDistrict && !err.noCommune && !err.noAddress) {
        console.log('Form hợp lệ:', newContact);
        const checkContact = user.value.contact.some(item => {
            return item.name === newContact.name &&
                item.phone === newContact.phone &&
                item.city === newContact.city &&
                item.district === newContact.district &&
                item.commune === newContact.commune;
        });

        if (checkContact) {
            err.someContact = true;
            console.log("Thông tin của bạn đã tồn tại, vui lòng thay đổi ít nhất một mục.");
        } else {
            err.someContact = false;
            user.value.contact.push(newContact);
            store.dispatch('apiEditCustomer', user.value);
            emit('close');
        }
    } else {
        console.log('Form có lỗi, vui lòng kiểm tra lại thông tin.');
    }
};

// Lấy danh sách thành phố
const fetchCities = async () => {
    try {
        const response = await axios.get('https://provinces.open-api.vn/api/p/');
        cities.value = response.data;
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu thành phố:', error);
    }
};

// Lấy danh sách quận/huyện dựa trên thành phố
const fetchDistricts = async (cityCode) => {
    try {
        const response = await axios.get(`https://provinces.open-api.vn/api/p/${cityCode}?depth=2`);
        districts.value = response.data.districts;
        communes.value = [];
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu quận/huyện:', error);
    }
};

// Lấy danh sách xã/phường dựa trên quận/huyện
const fetchCommunes = async (districtCode) => {
    try {
        const response = await axios.get(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
        communes.value = response.data.wards;
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu xã/phường:', error);
    }
};

watch(selectedCity, (newCity) => {
    if (newCity) {
        const city = cities.value.find(item => item.code === newCity);
        newContact.city = city.name;
        fetchDistricts(newCity);
    }
});

watch(selectedDistrict, (newDistrict) => {
    if (newDistrict) {
        const district = districts.value.find(item => item.code === newDistrict);
        newContact.district = district.name;
        fetchCommunes(newDistrict);
    }
});

watch(selectedCommune, (newCommune) => {
    if (newCommune) {
        const commune = communes.value.find(item => item.code === newCommune);
        newContact.commune = commune.name;
    }
});

onMounted(() => {
    fetchCities();
    fetchData();
});
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
}

.shipping-newContact-child {
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

.input-field {
    width: 100%;
    padding: 10px;
    border: 1px solid #d1d5db;
    border-radius: 5px;
    font-size: 14px;
    transition: border-color 0.2s;
}

.input-field:focus {
    outline: none;
    border-color: #3b82f6;
}

.select-field {
    width: 100%;
    padding: 10px;
    border: 1px solid #d1d5db;
    border-radius: 5px;
    background-color: #f9fafb;
    font-size: 14px;
    transition: border-color 0.2s;
    cursor: pointer;
}

.select-field:focus {
    border-color: #3b82f6;
    outline: none;
}

.error-text {
    color: #ef4444;
    font-size: 12px;
    margin-top: -8px;
}

.submit-btn {
    width: 100%;
    padding: 12px;
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 5px;
    font-weight: bold;
    transition: background-color 0.3s, transform 0.2s;
    cursor: pointer;
}

.submit-btn:hover {
    background-color: #2563eb;
    transform: translateY(-2px);
}

.submit-btn:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}
</style>

<template>
  <swiper
    :spaceBetween="30"
    :centeredSlides="true"
    :autoplay="{ delay: 5000, disableOnInteraction: false }"
    :pagination="{ clickable: true }"
    :navigation="true"
    :modules="modules"
    @slideChange="onSlideChange"
    class="mySwiper"
  >
    <swiper-slide v-for="(image, index) in images" :key="index">
      <img :src="image.src" :alt="`Slide ${index + 1}`" class="slide-img" />
      <div class="banner-text">
        <h2 class="slide-in-right">{{ image.text1 }}</h2>
        <h1 class="slide-in-left">{{ image.text2 }}</h1>
      </div>
    </swiper-slide>
  </swiper>
</template>

<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

const modules = [Autoplay, Pagination, Navigation];
const images = [
  { src: "@/assets/images/banner01.jpg", text1: "35% OFF", text2: "SPRING SALE" },
  { src: "@/assets/images/banner02.jpg", text1: "EXCLUSIVE", text2: "NEW ARRIVALS" },
  { src: "@/assets/images/banner07.png", text1: "UP TO", text2: "50% OFF" },
];

const onSlideChange = () => {
  document.querySelectorAll(".slide-in-left, .slide-in-right").forEach((el) => {
    el.style.animation = "none";
    setTimeout(() => (el.style.animation = ""), 50);
  });
};
</script>

<style scoped>
.mySwiper {
  width: 100%;
  height: 500px; /* Giảm chiều cao */
  border-radius: 15px; /* Thêm border-radius */
  overflow: hidden; /* Ẩn phần vượt ngoài khung */
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3); /* Thêm bóng */
}

.slide-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-text {
  position: absolute;
  top: 45%; /* Điều chỉnh để phù hợp với chiều cao mới */
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #fff;
  font-family: 'Montserrat', sans-serif;
  text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.6); /* Làm mờ nhẹ */
}

@keyframes slideInLeft {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}

@keyframes slideInRight {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

.slide-in-left {
  animation: slideInLeft 1s ease-out forwards; /* Giảm thời gian animation */
}
.slide-in-right {
  animation: slideInRight 1s ease-out forwards;
}

.banner-text h1 {
  font-size: 50px; /* Giảm kích thước font chữ */
  font-weight: 800;
}

.banner-text h2 {
  font-size: 25px; /* Giảm kích thước font chữ */
  color: #f54242;
}

.cta-button {
  display: inline-block;
  padding: 8px 20px; /* Giảm padding */
  font-size: 16px; /* Giảm kích thước font chữ */
  color: #fff;
  background-color: #f54242;
  border-radius: 20px;
  text-decoration: none;
  transition: all 0.3s;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3); /* Thêm bóng cho nút */
}

.cta-button:hover {
  background-color: #d13838;
  transform: translateY(-3px); /* Thêm hiệu ứng di chuyển khi hover */
}
</style>

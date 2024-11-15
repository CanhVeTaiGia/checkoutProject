<template>
  <footer class=" mt-10 bg-gray-900 text-white py-1  px-5 md:px-20 ">
    <div class="flex flex-col md:flex-row justify-between gap-10">
      <!-- About Us Section -->
      <div class="flex-1 min-w-[200px]">
        <h4 class="text-lg font-bold mb-4 text-pink-500">ABOUT US</h4>
        <p class="text-gray-400">
          Shop Quần Áo SimpleFashion là một cửa hàng thời trang chuyên cung cấp các sản phẩm quần áo phong cách, hiện đại và dễ phối
        </p>
      </div>
      <!-- Social Media Links -->
      <div class="flex-1 min-w-[200px]">
        <h4 class="text-lg font-bold mb-4">FOLLOW </h4>
        <div class="flex gap-4">
          <a href="#" class="text-gray-400 hover:text-pink-500 transition">
            <i class="fab fa-facebook-f"></i>
          </a>
          <a href="#" class="text-gray-400 hover:text-pink-500 transition">
            <i class="fab fa-twitter"></i>
          </a>
          <a href="#" class="text-gray-400 hover:text-pink-500 transition">
            <i class="fab fa-instagram"></i>
          </a>
          <a href="#" class="text-gray-400 hover:text-pink-500 transition">
            <i class="fab fa-pinterest-p"></i>
          </a>
        </div>
      </div>

      <!-- Contact Information -->
      <div class="flex-1 min-w-[200px]">
        <h4 class="text-lg font-bold mb-4">CONTACT US</h4>
        <p class="text-gray-400">123 Fashion Street, New York, NY</p>
        <p class="text-gray-400 mt-2">Phone: +0886666731</p>
        <p class="text-gray-400 mt-2">Email: dungpvn@fashionstore.com</p>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="border-t border-gray-700 mt-10 pt-5 text-center text-gray-500">
      <p>© 2024 Fashion Store. All rights reserved.</p>
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
a {
  transition: color 0.3s;
}
i {
  font-size: 18px;
  transition: color 0.3s;
}
</style>

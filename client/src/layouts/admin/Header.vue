<template>
  <header className="flex justify-between items-center bg-slate-100 w-full h-16 p-8">
    <h1 className="text-2xl font-bold">Dashboard</h1>
    <div className="flex items-center space-x-6">
      <div className="relative flex items-center justify-end gap-2">
        <img :src='admin.avatar' className="w-10 h-10 rounded-full" alt="Admin Avatar" />
        <span className="ml-2 text-gray-700">{{admin.name}}</span>
      </div>
    </div>
  </header>
</template>

<script setup>
const admin = JSON.parse(localStorage.getItem("userLogin")||[]);

</script>

<style></style>

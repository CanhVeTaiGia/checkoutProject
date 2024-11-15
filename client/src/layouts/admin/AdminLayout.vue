<template>
 <div class="flex w-full">
     <Menu/>
     <div class="w-full">
       <Header/>
    <router-view/> 
   </div>
 </div>
</template>

<script setup>
import Header from './Header.vue';
import Menu from './Menu.vue';
</script>

<style>

</style>
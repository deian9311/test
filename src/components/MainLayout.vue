<template>
  <div class="flex flex-col min-h-screen">
    <Navbar />  <!-- Добавяме Navbar -->
    <main class="flex-grow">
      <slot></slot>
    </main>
    <footer class="p-4 text-center text-white bg-gray-800">
      <p>&copy; 2024 Онлайн Магазин</p>
    </footer>
  </div>
</template>

<script setup>
import Navbar from './Navbar.vue';
</script>
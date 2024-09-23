<template>
    <header class="flex items-center justify-between p-4 text-black bg-blue-500">
      <div class="text-2xl font-bold">
        <router-link to="/">Магазин</router-link>
        <router-link to="/cart" class="relative">
        🛒 Количка ({{ cartItemCount }})
      </router-link>
      </div>
      <nav>
        <ul class="flex space-x-4">
          <li><router-link to="/">Начало</router-link></li>
          <li><router-link to="/products">Продукти</router-link></li>
          <li v-if="user"><router-link to="/admin">Админ Панел</router-link></li>
          <li v-if="user">{{ user.name }}</li>
          <li v-else><router-link to="/login">Вход</router-link></li>
          <li v-if="user"><button @click="logout" class="px-4 py-2 bg-red-500 rounded">Изход</button></li>
        </ul>
      </nav>
    </header>
  </template>
  
  <script setup>
  import { ref, onMounted,computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { jwtDecode } from 'jwt-decode';  // Правилният named import за версия 4.0.0
  import { useCartStore } from '../stores/cart';  // Импортиране на store
  const cartStore = useCartStore();

  
  const cartItemCount = computed(() => cartStore.cartItemCount);
  const router = useRouter();
  const user = ref(null);
  
  // Извличаме информацията за потребителя от токена
  onMounted(() => {
  const token = localStorage.getItem('token');
  if (token) {
    const decoded = jwtDecode(token);  // Декодираме токена
    console.log(decoded);  // Преглед на декодирания токен в конзолата
    if (decoded && decoded.user && decoded.user.name) {
      user.value = { name: decoded.user.name };  // Извличаме името на потребителя
    }
  }
});
  
  // Функция за изход
  const logout = () => {
    localStorage.removeItem('token');  // Премахваме токена
    user.value = null;  // Изчистваме потребителя
    router.push('/login');  // Пренасочване към логин страницата
  };
  </script>
  
  <style scoped>
  ul {
    list-style-type: none;
  }
  li {
    display: inline;
  }
  a {
    color: black;
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
  </style>
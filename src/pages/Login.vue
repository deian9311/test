<template>
    <MainLayout>
      <div class="max-w-md p-8 mx-auto">
        <h2 class="mb-6 text-3xl font-bold">Вход</h2>
        <form @submit.prevent="loginUser" class="space-y-4">
          <input v-model="email" type="email" placeholder="Имейл" class="input" required />
          <input v-model="password" type="password" placeholder="Парола" class="input" required />
          <button type="submit" class="px-4 py-2 text-white bg-blue-500 rounded">Вход</button>
        </form>
        <p class="mt-4">Нямате акаунт? <router-link to="/register">Регистрация</router-link></p>
      </div>
    </MainLayout>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import axios from 'axios';
  import { useRouter } from 'vue-router';
  
  const email = ref('');
  const password = ref('');
  const router = useRouter();
  
  const loginUser = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: email.value,
        password: password.value,
      });
      const token = response.data.token;
  
      // Запазваме токена в localStorage
      localStorage.setItem('token', token);
  
      alert('Успешен вход!');
      router.push('/'); // Пренасочваме потребителя след успешен логин
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Невалидни данни за вход.');
    }
  };
  </script>
  
  <style scoped>
  .input {
    display: block;
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 0.25rem;
  }
  </style>
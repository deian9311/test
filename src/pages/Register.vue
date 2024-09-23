<template>
    <MainLayout>
      <div class="max-w-md p-8 mx-auto">
        <h2 class="mb-6 text-3xl font-bold">Регистрация</h2>
        <form @submit.prevent="registerUser" class="space-y-4">
          <input v-model="name" type="text" placeholder="Име" class="input" required />
          <input v-model="email" type="email" placeholder="Имейл" class="input" required />
          <input v-model="password" type="password" placeholder="Парола" class="input" required />
          <button type="submit" class="px-4 py-2 text-white bg-blue-500 rounded">Регистрация</button>
        </form>
        <p class="mt-4">Вече имате акаунт? <router-link to="/login">Вход</router-link></p>
      </div>
    </MainLayout>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import axios from 'axios';
  import { useRouter } from 'vue-router';
  
  const name = ref('');
  const email = ref('');
  const password = ref('');
  const router = useRouter();
  
  const registerUser = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name: name.value,
        email: email.value,
        password: password.value,
      });
      const token = response.data.token;
  
      // Запазваме токена в localStorage
      localStorage.setItem('token', token);
  
      alert('Регистрацията е успешна!');
      router.push('/'); // Пренасочваме потребителя след успешна регистрация
    } catch (error) {
      console.error('Error registering user:', error);
      alert('Регистрацията не бе успешна.');
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
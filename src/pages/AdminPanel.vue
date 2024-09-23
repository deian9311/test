<template>
    <MainLayout>
      <div class="max-w-md p-8 mx-auto">
        <h2 class="mb-6 text-3xl font-bold">Добавяне на продукт</h2>
        <form @submit.prevent="addProduct" class="space-y-4">
          <input v-model="name" type="text" placeholder="Име на продукта" class="input" required />
          <input v-model="description" type="text" placeholder="Описание" class="input" required />
          <input v-model="price" type="number" placeholder="Цена" class="input" required />
          <input v-model="category" type="text" placeholder="Категория" class="input" required />
          <input v-model="stock" type="number" placeholder="Наличност" class="input" required />
          
          <!-- Input за качване на снимка -->
          <input @change="handleFileUpload" type="file" class="input" required />
          
          <button type="submit" class="px-4 py-2 text-white bg-blue-500 rounded">Добави продукт</button>
        </form>
      </div>
    </MainLayout>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import axios from 'axios';
  import { useRouter } from 'vue-router';
  
  const name = ref('');
  const description = ref('');
  const price = ref('');
  const category = ref('');
  const stock = ref('');
  const file = ref(null);  // Държим файла тук
  
  const router = useRouter();
  
  // Функция за обработка на качения файл
  const handleFileUpload = (event) => {
    file.value = event.target.files[0];  // Съхраняваме файла
  };
  
  const addProduct = async () => {
    try {
      const token = localStorage.getItem('token');
  
      const formData = new FormData();
      formData.append('name', name.value);
      formData.append('description', description.value);
      formData.append('price', price.value);
      formData.append('category', category.value);
      formData.append('stock', stock.value);
      formData.append('image', file.value);  // Добавяме файла към formData
  
      const response = await axios.post('http://localhost:5000/api/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-auth-token': token,  // Изпращаме токена
        }
      });
  
      alert('Продуктът е добавен успешно!');
      router.push('/');  // Пренасочваме към началната страница
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Грешка при добавяне на продукта.');
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
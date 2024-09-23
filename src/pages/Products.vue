<template>
  <MainLayout>
    <div class="container p-8 mx-auto">
      <h2 class="mb-8 text-4xl font-bold text-center text-gray-800">Нашите продукти</h2>
      
      <div v-if="loading" class="text-xl text-center text-gray-500">Зареждане на продукти...</div>
      <div v-if="error" class="text-xl text-center text-red-500">{{ error }}</div>

      <div v-if="products.length > 0" class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div 
          v-for="product in products" 
          :key="product._id" 
          class="p-6 bg-white border rounded-lg shadow-lg"
        >
          <!-- Снимка на продукта -->
          <div class="w-full h-64 mb-4 overflow-hidden rounded-md">
            <img 
              :src="getProductImage(product)" 
              alt="Product Image" 
              class="object-cover w-full h-full"
            />
          </div>

          <!-- Име и описание на продукта -->
          <h3 class="mb-2 text-lg font-semibold text-gray-800">{{ product.name }}</h3>
          <p class="mb-4 text-sm text-gray-600">{{ product.description }}</p>
          <p class="text-xl font-bold text-green-600">{{ product.price }} лв.</p>

          <!-- Бутон за добавяне в количката -->
          <button @click="addToCart(product)" class="px-4 py-2 mt-4 text-white bg-blue-500 rounded-md">
            Добави в количката
          </button>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useCartStore } from '../stores/cart';  // Импортираме Pinia store за количката

const products = ref([]);
const loading = ref(true);
const error = ref(null);

const cartStore = useCartStore();  // Използваме Pinia store

// Функция за извличане на продуктите
const fetchProducts = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/products');
    products.value = response.data; // Зареждаме продуктите
    loading.value = false;
  } catch (err) {
    error.value = 'Грешка при зареждането на продуктите.';
    loading.value = false;
  }
};

// Функция за получаване на пътя до снимката на продукта
const getProductImage = (product) => {
  return product.image ? `http://localhost:5000/${product.image}` : 'https://via.placeholder.com/150'; // Placeholder, ако няма снимка
};

// Функция за добавяне на продукт в количката
const addToCart = (product) => {
  cartStore.addToCart(product);  // Използваме функцията addToCart от Pinia store

  debugger
  alert(`${product.name} добавен в количката!`);
};

onMounted(() => {
  fetchProducts();
});
</script>

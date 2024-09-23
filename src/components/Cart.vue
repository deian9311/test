<template>
  <MainLayout>
    <div class="container p-8 mx-auto">
      <h2 class="mb-6 text-3xl font-bold">Вашата количка</h2>

      <!-- Показваме съобщение, ако количката е празна -->
      <div v-if="cart.length === 0" class="text-xl text-center text-gray-500">
        Количката е празна.
      </div>

      <!-- Показваме продуктите в количката, ако има добавени продукти -->
      <div v-else>
        <div v-for="item in cart" :key="item._id" class="flex items-center justify-between py-4 border-b">
          <div>
            <h3 class="text-lg font-semibold">{{ item.name }}</h3>
            <p class="text-gray-600">Количество: {{ item.quantity }}</p>
            <p class="font-bold text-green-600">{{ item.price }} лв.</p>
          </div>
          <button @click="removeFromCart(item._id)" class="px-4 py-2 text-red-500">Премахни</button>
        </div>

        <div class="mt-6">
          <h3 class="text-2xl font-bold">Обща сума: {{ totalPrice }} лв.</h3>
        </div>

        <div class="mt-4">
          <button @click="clearCart" class="px-4 py-2 text-white bg-red-500 rounded-md">Изчисти количката</button>
        </div>

        <!-- Форма за завършване на поръчката -->
        <div class="mt-6">
          <h3 class="text-xl font-bold">Данни за поръчка</h3>
          <form @submit.prevent="completeOrder">
            <input v-model="customerName" type="text" placeholder="Вашето име" class="block w-full p-2 mt-4 border" required />
            <input v-model="customerEmail" type="email" placeholder="Вашият имейл" class="block w-full p-2 mt-4 border" required />
            <textarea v-model="customerAddress" placeholder="Вашият адрес" class="block w-full p-2 mt-4 border" required></textarea>
            <button type="submit" class="px-4 py-2 mt-4 text-white bg-blue-500 rounded-md">
              Завърши поръчката
            </button>
          </form>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useCartStore } from '../stores/cart';
import axios from 'axios';

const cartStore = useCartStore();
const cart = computed(() => cartStore.cart);
const totalPrice = computed(() => cartStore.totalPrice);

// Полета за данни на клиента
const customerName = ref('');
const customerEmail = ref('');
const customerAddress = ref('');

// Функция за премахване на продукт от количката
const removeFromCart = (productId) => {
  cartStore.removeFromCart(productId);
};

// Функция за изчистване на количката
const clearCart = () => {
  cartStore.clearCart();
};

// Функция за завършване на поръчката
const completeOrder = async () => {
  try {
    const orderData = {
      products: cart.value,
      total: totalPrice.value,
      customerName: customerName.value,
      customerEmail: customerEmail.value,
      customerAddress: customerAddress.value,
    };

    // Изпращаме данните за поръчката към бекенда
    await axios.post('http://localhost:5000/api/orders', orderData);

    alert('Поръчката е изпратена успешно!');
    clearCart();  // Изчистваме количката след успешна поръчка
  } catch (error) {
    console.error('Грешка при изпращане на поръчката:', error);
    alert('Възникна грешка при изпращането на поръчката.');
  }
};
</script>

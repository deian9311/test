<template>
    <div>
      <h2 class="mb-6 text-3xl font-bold">Всички поръчки</h2>
  
      <!-- Таблица с поръчки -->
      <table class="w-full mb-4 table-auto">
        <thead>
          <tr>
            <th class="px-4 py-2">Име на клиента</th>
            <th class="px-4 py-2">Имейл</th>
            <th class="px-4 py-2">Адрес</th>
            <th class="px-4 py-2">Продукти</th>
            <th class="px-4 py-2">Обща сума</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order._id">
            <td class="px-4 py-2 border">{{ order.customerName }}</td>
            <td class="px-4 py-2 border">{{ order.customerEmail }}</td>
            <td class="px-4 py-2 border">{{ order.customerAddress }}</td>
            <td class="px-4 py-2 border">
              <ul>
                <li v-for="product in order.products" :key="product._id">
                  {{ product.name }} - {{ product.quantity }} бр.
                </li>
              </ul>
            </td>
            <td class="px-4 py-2 border">{{ order.total }} лв.</td>
          </tr>
        </tbody>
      </table>
  
      <!-- Графика за поръчките -->
      <div class="mt-6">
        <canvas id="ordersChart" width="400" height="200"></canvas>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue';
  import axios from 'axios';
  
  import { Chart, BarController, LineController, BarElement, LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip } from 'chart.js';

// Регистриране на компонентите
Chart.register(BarController, LineController, BarElement, LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip);
  
  const orders = ref([]);
  
  // Зареждаме поръчките от backend при монтиране на компонента
  onMounted(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/orders');
      orders.value = response.data;
  
      // Извикваме функцията за рендиране на графиката, след като поръчките са заредени
      renderChart();
    } catch (error) {
      console.error('Грешка при зареждането на поръчките:', error);
    }
  });
  
  // Подготвяме данните за графиката
  const prepareChartData = () => {
    const orderDates = {};  // Обект за съхранение на датите и общите суми
  
    orders.value.forEach(order => {
      const date = new Date(order.date).toLocaleDateString();
      if (!orderDates[date]) {
        orderDates[date] = { totalAmount: 0, count: 0 };
      }
      orderDates[date].totalAmount += order.total;
      orderDates[date].count++;
    });
  
    // Разделяме данните за Chart.js
    const labels = Object.keys(orderDates); // Дати
    const data = Object.values(orderDates).map(entry => entry.totalAmount); // Обща сума за всяка дата
    const orderCounts = Object.values(orderDates).map(entry => entry.count); // Брой поръчки за всяка дата
  
    return { labels, data, orderCounts };
  };
  
  // Рендираме графиката с Chart.js
  const renderChart = () => {
    const ctx = document.getElementById('ordersChart').getContext('2d');
    const chartData = prepareChartData();
  
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: chartData.labels,
        datasets: [
          {
            label: 'Обща сума на поръчките (лв.)',
            data: chartData.data,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
          {
            label: 'Брой поръчки',
            data: chartData.orderCounts,
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1,
            type: 'line',  // Правим бройката като линия
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  };
  </script>
  
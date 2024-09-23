import { createRouter, createWebHistory } from 'vue-router';
import Home from './pages/Home.vue';
import Products from './pages/Products.vue';
import AdminPanel from './pages/AdminPanel.vue';
import Register from './pages/Register.vue';  // Добавяме регистрация
import Login from './pages/Login.vue';        // Добавяме логин
import Cart from './pages/Cart.vue'; 
import Order from './pages/Admin/AdminOrders.vue'; 

const routes = [
  { path: '/', component: Home },
  { path: '/products', component: Products },
  { path: '/admin', component: AdminPanel },   // Защитена админ страница
  { path: '/register', component: Register },  // Рут за регистрация
  { path: '/login', component: Login },        // Рут за логин
  { path: '/cart', component: Cart },        // Рут за логин
  { path: '/orders', component: Order },        // Рут за логин
];

const router = createRouter({
history: createWebHistory(),
  routes,
});

export default router;
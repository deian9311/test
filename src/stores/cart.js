import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    cart: JSON.parse(localStorage.getItem('cart')) || [],  // Възстановяваме количката от localStorage, ако има
  }),
  
  getters: {
    cartItemCount: (state) => state.cart.length,
    totalPrice: (state) => {
      return state.cart.reduce((total, item) => total + item.price * item.quantity, 0);
    },
  },

  actions: {
    addToCart(product) {
      const existingProduct = this.cart.find((item) => item._id === product._id);
      if (existingProduct) {
        existingProduct.quantity++;
      } else {
        this.cart.push({ ...product, quantity: 1 });
      }
      this.saveCart();  // Запазваме количката в localStorage при добавяне
    },

    removeFromCart(productId) {
      this.cart = this.cart.filter((item) => item._id !== productId);
      this.saveCart();  // Запазваме количката в localStorage при премахване
    },

    clearCart() {
      this.cart = [];
      this.saveCart();  // Изчистваме и localStorage
    },

    // Метод за запазване на количката в localStorage
    saveCart() {
      localStorage.setItem('cart', JSON.stringify(this.cart));
    }
  },
});
const express = require('express');
require('dotenv').config();  // Зареждаме dotenv за достъп до .env променливите
const cors = require('cors');  // Добавяме cors
const mongoose = require('mongoose');
require('dotenv').config();
const path = require('path');
const orders = require('./routes/orders');  // Импортираме рутовете за поръчките

const app = express();

// Активиране на CORS за всички заявки
app.use(cors());

// Middlewares
app.use(express.json());

// MongoDB връзка
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error(err));

// Рутове
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/orders', orders);  // Рут за поръчки

// Стартиране на сървъра
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
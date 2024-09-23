// routes/orders.js
const express = require('express');
const Order = require('../models/Order');
const nodemailer = require('nodemailer'); // За изпращане на имейли

const router = express.Router();

const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware'); // Middleware за проверка на администратор


// GET /api/orders - Вземане на всички поръчки (само за администратори)
router.get('/', async (req, res) => {
    try {
      const orders = await Order.find(); // Вземаме всички поръчки от базата данни
      res.json(orders); // Връщаме поръчките като JSON
    } catch (err) {
      console.error('Грешка при зареждането на поръчките:', err);
      res.status(500).json({ msg: 'Сървърна грешка' });
    }
  });

// Рут за създаване на поръчка
router.post('/', async (req, res) => {
  const { products, total, customerName, customerEmail, customerAddress } = req.body;

  try {
    // Създаваме нова поръчка в базата данни
    const newOrder = new Order({
      products,
      total,
      customerName,
      customerEmail,
      customerAddress,
    });

    await newOrder.save();

    // Изпращаме имейл до администратора
    sendOrderEmail(newOrder);

    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Грешка при създаване на поръчката:', error);
    res.status(500).json({ message: 'Възникна грешка при създаване на поръчката.' });
  }
});

// Функция за изпращане на имейл до администратора
const sendOrderEmail = (order) => {


    console.log(111,process.env.ADMIN_EMAIL)
    console.log(222,process.env.ADMIN_PASSWORD)

  const transporter = nodemailer.createTransport({
    service: 'gmail', // Можеш да използваш твоя имейл доставчик
    auth: {
      user: process.env.ADMIN_EMAIL, // Имейл на администратора
      pass: process.env.ADMIN_PASSWORD, // Парола на администратора
    },
  });

  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to: process.env.ADMIN_EMAIL, // Имейлът на администратора
    subject: 'Нова поръчка',
    text: `Име на клиента: ${order.customerName}\nИмейл: ${order.customerEmail}\nАдрес: ${order.customerAddress}\nОбща сума: ${order.total} лв.\n\nПродукти: ${order.products.map(p => `${p.name} - ${p.quantity} бр.`).join('\n')}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Грешка при изпращане на имейла:', error);
    } else {
      console.log('Имейл изпратен: ' + info.response);
    }
  });
};

module.exports = router;
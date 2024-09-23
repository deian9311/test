const express = require('express');
const multer = require('multer');  // За обработка на файлове
const Product = require('../models/Product');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Настройка на Multer за качване на снимки
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');  // Запазване в папката 'uploads'
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);  // Уникално име на файла
  }
});

const upload = multer({ storage });

// Рут за извличане на всички продукти
router.get('/', async (req, res) => {
  try {
    const products = await Product.find(); // Взимаме всички продукти
    res.json(products);  // Връщаме продуктите като JSON
  } catch (error) {
    console.error('Грешка при извличане на продуктите:', error.message);
    res.status(500).json({ msg: 'Сървърна грешка при извличане на продуктите.' });
  }
});

// Рут за създаване на нов продукт с качване на снимка
router.post('/', authMiddleware, adminMiddleware, upload.single('image'), async (req, res) => {
  const { name, description, price, category, stock } = req.body;

  try {
    const imagePath = req.file ? req.file.path : null;  // Ако има качена снимка

    const newProduct = new Product({
      name,
      description,
      price,
      category,
      stock,
      image: imagePath  // Запазваме пътя към снимката в базата данни
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Грешка при запазване на продукта:', error.message);
    res.status(400).json({ msg: 'Грешка при добавяне на продукта.' });
  }
});

module.exports = router;
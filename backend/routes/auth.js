const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');

const router = express.Router();

// Регистрация
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
  
    try {
      let user = await User.findOne({ email });
  
      if (user) {
        return res.status(400).json({ msg: 'Потребител с този имейл вече съществува.' });
      }
  
      user = new User({
        name,
        email,
        password,
        isAdmin: false  // По подразбиране, новият потребител не е администратор
      });
  
      // Хеширане на паролата
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
  
      // Запазване на новия потребител в базата данни
      await user.save();
  
      // Генериране на JWT токен
      const payload = {
        user: {
          id: user.id,
          name: user.name,
          isAdmin: user.isAdmin  // Добавяне на isAdmin в JWT токена
        }
      };
  
      jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

// Логин
router.post(
  '/login',
  [
    check('email', 'Моля въведете валиден имейл').isEmail(),
    check('password', 'Паролата е задължителна').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Проверка за съществуващ потребител
      let user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ msg: 'Невалидни потребителски данни' });
      }

      // Проверка на паролата
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ msg: 'Невалидни потребителски данни' });
      }

      // Генериране на JWT при успешен логин
      const payload = {
        user: {
          id: user.id,
          name: user.name,  // Добавяне на името в токена при логин
          isAdmin: user.isAdmin  // Увери се, че добавяш isAdmin в токена
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '1h' },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
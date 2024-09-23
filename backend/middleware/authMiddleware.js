const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Увери се, че имаш достъп до модела User

const authMiddleware = (req, res, next) => {
  const token = req.header('x-auth-token');

  console.log("Получен токен:", token);  // Логваме токена

  if (!token) {
    console.log("Липсва токен!");  // Ако няма токен
    return res.status(403).json({ msg: 'Отказан достъп, липсва токен.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;  // Декодиране на потребителя от токена

    console.log("Успешно декодиран потребител:", req.user);  // Логваме декодирания потребител
    next();
  } catch (err) {
    console.error("Невалиден токен:", err.message);  // Логваме грешката при декодиране
    res.status(403).json({ msg: 'Невалиден токен.' });
  }
};


const adminMiddleware = async (req, res, next) => {
    try {
      // Вземаме ID на потребителя от декодирания токен
      const userId = req.user.id;
  
      // Правим заявка към базата данни, за да намерим потребителя по ID
      const user = await User.findById(userId);
  
      // Проверяваме дали потребителят съществува и дали е администратор
      if (user && user.isAdmin) {
        console.log("Потребителят е администратор:", user);
        next(); // Ако е администратор, продължаваме
      } else {
        console.log("Потребителят не е администратор или не съществува:", user);
        res.status(403).json({ msg: 'Нямате администраторски права.' });
      }
    } catch (error) {
      console.error("Грешка при проверка на администраторски права:", error.message);
      res.status(500).json({ msg: 'Сървърна грешка.' });
    }
  };
  

module.exports = { authMiddleware, adminMiddleware };
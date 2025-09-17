const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require("crypto");
require('dotenv').config();

// Реєстрація нового користувача
exports.register = async function(req, res) {
  try {
    const { name, email, password, drivingStatus } = req.body;

    if (!name || !email || !password || !drivingStatus) {
      return res.status(400).json({ error: 'Всі поля обов\'язкові' });
    }

    const allowed = ["Так", "Навчаюсь", "Ні"];
    if (!allowed.includes(drivingStatus)) {
      return res.status(400).json({ error: "Неправильне значення для випадаючого списку" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: 'Користувач з таким email вже існує' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const activationToken = crypto.randomBytes(32).toString("hex");

    const newUser = await User.create({
      name,
      email,
      password: hashed,
      drivingStatus,
      isActive: false,
      activationToken,
    });

    const { password: _, ...userData } = newUser.toObject();

    res.status(201).json({ user: userData, email, activationToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Помилка сервера під час реєстрації' });
  }
};

// Активація акаунту через токен
exports.activateAccount = async function(req, res) {
  try {
    const { token } = req.body;

    const user = await User.findOne({ activationToken: token });

    if (!user) {
      return res.status(400).json({ error: "Недійсний або застарілий токен активації" });
    }

    user.isActive = true;
    user.activationToken = undefined;
    await user.save();

    res.status(200).json({ message: "Профіль успішно активовано" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Помилка сервера при активації" });
  }
};

// Повторне надсилання токена активації
exports.resendActivateAccount = async function(req, res) {
  try {
    const { email } = req.body;

    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return res.status(400).json({ error: 'Невірний формат електронної пошти' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'Користувача з такою поштою не знайдено' });
    }

    if (user.isActive) {
      return res.status(400).json({ error: 'Акаунт вже активовано' });
    }

    const activationToken = crypto.randomBytes(32).toString('hex');
    
    user.activationToken = activationToken;
    user.tokenExpiration = Date.now() + 24 * 60 * 60 * 1000; 
    
    await user.save();

    return res.status(200).json({ 
      message: 'Новий токен активації створено', 
      activationToken 
    });
  } catch (error) {
    console.error('Помилка при повторному надсиланні активації:', error);
    return res.status(500).json({ error: 'Помилка сервера при повторному надсиланні активації' });
  }
};


// Вхід користувача
exports.login = async function(req, res) {
  try {
    const { email, password } = req.body;
    console.log(" req.body: ",  req.body);
    if (!email || !password) {
      return res.status(400).json({ error: 'Email і пароль обов\'язкові' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'Користувача не знайдено' });
    }

    if (!user.isActive) {
      return res.status(403).json({
        error: "Акаунт не активовано. Перевірте пошту для активації.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Невірні облікові дані' });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1day' }
    );

    res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Помилка сервера під час логіну' });
  }
};

// Перевірка авторизації токеном
exports.auth = async function (req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Немає токена' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'Користувача не знайдено' });
    }
    
    res.status(200).json({ message: 'Токен дійсний', user, token });
  } catch (err) {
    return res.status(403).json({ error: 'Недійсний токен' });
  }
};

// Отримання профілю користувача
exports.getProfile = async function(req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Немає токена' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password'); 
    if (!user) {
      return res.status(404).json({ error: 'Користувача не знайдено' });
    }

    res.status(200).json({ message: 'Токен дійсний', user, token });
  } catch (err) {
    res.status(403).json({ error: 'Недійсний токен' });
  }
};

// Зміна паролю користувача
exports.changePassword = async function(req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Немає токена' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Всі поля обов’язкові' });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ error: 'Користувача не знайдено' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Невірний поточний пароль' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.json({ message: 'Пароль успішно змінено' });
  } catch (err) {
    console.error(err);
    res.status(403).json({ error: 'Недійсний токен' });
  }
};

// Зміна імені користувача 
exports.updateProfile = async function(req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Немає токена' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { name, drivingStatus } = req.body;

    if (name && name.length < 2) {
      return res.status(400).json({ error: "Ім'я повинно містити щонайменше 2 символи" });
    }

    const allowedStatuses = ["Так", "Навчаюсь", "Ні"];
    if (drivingStatus && !allowedStatuses.includes(drivingStatus)) {
      return res.status(400).json({ error: "Невірний статус" });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ error: 'Користувача не знайдено' });
    }

    if (name) user.name = name;
    if (drivingStatus) user.drivingStatus = drivingStatus;
    await user.save();

    res.status(200).json({ message: 'Профіль оновлено успішно', user: { name: user.name, email: user.email, drivingStatus: user.drivingStatus } });
  } catch (err) {
    console.error(err);
    res.status(403).json({ error: 'Недійсний токен' });
  }
};

// Видалення акаунту користувача
exports.deleteAccount = async function (req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Немає токена" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await User.findByIdAndDelete(decoded.id);
    res.status(200).json({ message: "Акаунт видалено" });
  } catch (err) {
    console.error(err);
    res.status(403).json({ error: "Помилка при видаленні акаунту" });
  }
};

// Визначення рівня обізнаності користувача


// exports.drivingStatus = async (req, res) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({ error: "Немає токена" });
//   }

//   const token = authHeader.split(" ")[1];

// try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const { drivingStatus } = req.body;

//     if (!["Так", "Навчаюсь", "Ні"].includes(drivingStatus)) {
//       return res.status(400).json({ error: "Неправильне значення" });
//     }

//     const user = await User.findById(decoded.id);
//     if (!user) {
//       return res.status(404).json({ error: "Користувача не знайдено" });
//     }

//     user.drivingStatus = drivingStatus;
//     await user.save();

//     res.status(200).json({ message: "Статус оновлено", drivingStatus: user.drivingStatus });
//   } catch (err) {
//     console.error(err);
//     res.status(403).json({ error: "Недійсний токен" });
//   }

//   // try {
//   //   const { id } = req.params;
//   //   const { drivingStatus } = req.body;
//   //   const user = await User.findByIdAndUpdate(
//   //     id,
//   //     { drivingStatus },
//   //     { new: true }
//   //   );
//   //   res.json(user);
//   // } catch (err) {
//   //   res.status(500).json({ error: "Update failed" });
//   // }
// };
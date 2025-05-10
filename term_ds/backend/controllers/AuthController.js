const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Контролер реєстрації
exports.register = async function(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Всі поля обов\'язкові' });
    }

    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(409).json({ error: 'Користувач з таким email вже існує' });
    }

    const hashed = await bcrypt.hash(password, 10);

    const newUser = await User.create({ name, email, password: hashed });

    const { password: _, ...userData } = newUser.toObject();
    res.status(201).json({ user: userData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Помилка сервера під час реєстрації' });
  }
};

// Контролер логіну
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


exports.auth = function (req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Немає токена' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ message: 'Токен дійсний', user: decoded, token });
  } catch (err) {
    return res.status(403).json({ error: 'Недійсний токен' });
  }
};
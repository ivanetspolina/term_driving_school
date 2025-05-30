const express = require('express');
const authRoutes = require('./routes/Auth.js');
const testRoutes = require('./routes/Test.js');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const PORT = process.env.PORT || 4000;

const app = express();
app.use(express.json());
app.use(cors());

// Підключаємо MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Маршрути авторизації та тестів
app.use("/auth", authRoutes);
app.use("/tests", testRoutes); 

// Запускаємо сервер
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});




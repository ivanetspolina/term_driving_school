const mongoose = require('mongoose');

// Схема моделі для збереження інформації про зареєстрованих користувачів
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  drivingStatus: { type: String, enum: ["Так", "Навчаюсь", "Ні"], required: true },
  isActive: { type: Boolean, default: false },
  activationToken: String,
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
const mongoose = require('mongoose');

// Схема моделі для збереження на назви та типу тесту
const testSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Test', testSchema);
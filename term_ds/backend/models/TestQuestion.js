const mongoose = require('mongoose');

// Схема моделі для збереження згенерованих питань тесту
const testQuestionSchema = new mongoose.Schema({
  test: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
    required: true,
    index: true
  },
  questionIndex: {
    type: Number,
    required: true
  },
  questionData: {
    id: { type: String, required: true },
    sign_positions: [{
      direction: { type: String, required: true },
      sign_id: { type: String, required: true }
    }],
    carsToPlace: [{
      car_id: { type: String, required: true },
      start_cars_points: { type: Number, required: true },
      path_type: { type: String, required: true }
    }]
  }
}, { timestamps: true });

// Індекс для швидкого пошуку питань за тестом та індексом
testQuestionSchema.index({ test: 1, questionIndex: 1 }, { unique: true });

module.exports = mongoose.model('TestQuestion', testQuestionSchema);

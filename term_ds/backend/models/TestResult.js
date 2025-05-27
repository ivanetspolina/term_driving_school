const mongoose = require('mongoose');

const testResultSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  topic: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
  score: { type: Number, required: true },
  scoreIncorrect: { type: Number, required: true },
  time: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('TestResult', testResultSchema);

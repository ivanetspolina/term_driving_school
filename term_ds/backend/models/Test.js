const mongoose = require('mongoose');

// Схема моделі для збереження на назви та типу тесту
const testSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      unique: true,
    },
    isGenerated: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
      index: true,
    },
  },
  { timestamps: true }
);
// const testSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   type: {
//     type: String,
//     required: true, 
//     unique: true,
//   },
//   isGenerated: {
//     type: Boolean,
//     default: false,
//   }
// }, { timestamps: true });

module.exports = mongoose.model('Test', testSchema);
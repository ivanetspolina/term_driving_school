const mongoose = require("mongoose");

const testStatSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true, // один запис статистики на користувача
      required: true,
    },
    totalTests: {
      type: Number,
      default: 0,
    },
    cancelledTests: {
      type: Number,
      default: 0,
    },
    flawlessTests: {
      type: Number,
      default: 0, // Пройдено без жодної помилки
    },
    passedWithFewMistakes: {
      type: Number,
      default: 0, // Пройдено з ≤3 помилками
    },
    dailyStats: [
      {
        date: { type: Date, required: true },
        testsTaken: { type: Number, default: 0 } // тільки завершені (не скасовані)
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("TestStat", testStatSchema);

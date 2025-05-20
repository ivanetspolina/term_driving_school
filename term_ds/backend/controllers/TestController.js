const Test = require('../models/Test');

// Отримати всі тести
exports.getAllTests = async (req, res) => {
  try {
    const tests = await Test.find().sort({ createdAt: -1 });
    res.json(tests);
  } catch (err) {
    console.error('❌ Error fetching tests:', err);
    res.status(500).json({ error: 'Помилка сервера' });
  }
};

exports.getTestById = async (req, res) => {
  try {
    const { id } = req.params;
    const test = await Test.findById(id);

    if (!test) {
      return res.status(404).json({ error: "Тест не знайдено" });
    }

    res.json({ test });
  } catch (err) {
    console.error("❌ Error getting test by ID:", err);
    res.status(500).json({ error: "Помилка сервера" });
  }
};

const Test = require('../models/Test');
const TestResult = require('../models/TestResult');
const jwt = require('jsonwebtoken');

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

exports.saveTestResult = async (req, res) => {
  try {
    const { user, score, scoreIncorrect, time, topicid } = req.body;
    console.log("req.body: ", req.body);

    const result = await TestResult.create({
      user,
      score,
      scoreIncorrect,
      time,
      topic: topicid
    });

    res.status(201).json({ message: 'Результат збережено', result });
  } catch (err) {
    console.error('❌ Error saving test result:', err);
    res.status(500).json({ error: 'Помилка при збереженні результату' });
  }
};

exports.getUserResults = async function(req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Немає токена' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const results = await TestResult.find({ user: decoded.id }).populate('topic', 'title');

    res.status(200).json(results);
  } catch (err) {
    console.error("❌ Error getting user results:", err);
    res.status(500).json({ error: "Помилка при отриманні статистики" });
  }
};
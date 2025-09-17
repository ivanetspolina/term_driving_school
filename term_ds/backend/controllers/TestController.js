const Test = require('../models/Test');
const TestResult = require('../models/TestResult');
const jwt = require('jsonwebtoken');

// Отримуємо всі тести разом зі статистикою
exports.getAllTests = async (req, res) => {
  try {
    const tests = await Test.find();
    const results = await TestResult.find();

    const resultMap = {};

    results.forEach((r) => {
      const topicId = r.topic?.toString();
      if (!topicId) return;

      if (!resultMap[topicId]) {
        resultMap[topicId] = { success: 0, error: 0 };
      }

      if (r.score >= 18) {
        resultMap[topicId].success++;
      } else {
        resultMap[topicId].error++;
      }
    });

    const testsWithStats = tests.map((test) => {
      const stats = resultMap[test._id.toString()] || { success: 0, error: 0 };
      return { ...test.toObject(), ...stats };
    });

    res.json(testsWithStats);
  } catch (err) {
    console.error("Помилка при отриманні тестів:", err);
    res.status(500).json({ error: "Помилка сервера при отриманні тестів" });
  }
};

// Отримуємо тест за ID
exports.getTestById = async (req, res) => {
  try {
    const { id } = req.params;
    const test = await Test.findById(id);

    if (!test) {
      return res.status(404).json({ error: "Тест не знайдено" });
    }

    res.json({ test });
  } catch (err) {
    console.error("Помилка отримання тесту за ідентифікатором:", err);
    res.status(500).json({ error: "Помилка сервера" });
  }
};

// Зберігаємо результати проходження тесту
exports.saveTestResult = async (req, res) => {
  try {
    const { user, score, scoreIncorrect, time, topicid, questionTimes } = req.body;
    console.log("req.body: ", req.body);

    const result = await TestResult.create({
      user,
      score,
      scoreIncorrect,
      time,
      topic: topicid,
      questionTimes
    });

    res.status(201).json({ message: 'Результат збережено', result });
  } catch (err) {
    console.error('Помилка збереження результату тесту:', err);
    res.status(500).json({ error: 'Помилка при збереженні результату' });
  }
};

// Отримуємо всі результати тестів для поточного користувача
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
    console.error("Помилка отримання результатів користувача:", err);
    res.status(500).json({ error: "Помилка при отриманні статистики" });
  }
};


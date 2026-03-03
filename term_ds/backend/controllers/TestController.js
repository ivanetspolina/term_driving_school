const Test = require('../models/Test');
const TestResult = require('../models/TestResult');
const TestQuestion = require('../models/TestQuestion');
const jwt = require('jsonwebtoken');

// Отримуємо всі тести разом зі статистикою
exports.getAllTests = async (req, res) => {
  try {
    const tests = await Test.find();

    // пробуємо отримати токен
    const authHeader = req.headers.authorization;
    let userId = null;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id;
      } catch (err) {
        console.warn("JWT невірний або прострочений:", err.message);
      }
    }

    // Якщо є userId → фільтруємо результати тільки цього користувача
    const results = userId
      ? await TestResult.find({ user: userId })
      : await TestResult.find(); // можна і пустий масив, якщо не треба глобальна статистика

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

    // Приєднуємо статистику до кожного тесту
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
// exports.getAllTests = async (req, res) => {
//   try {
//     const tests = await Test.find();
//     const results = await TestResult.find();

//     const resultMap = {};

//     results.forEach((r) => {
//       const topicId = r.topic?.toString();
//       if (!topicId) return;

//       if (!resultMap[topicId]) {
//         resultMap[topicId] = { success: 0, error: 0 };
//       }

//       if (r.score >= 18) {
//         resultMap[topicId].success++;
//       } else {
//         resultMap[topicId].error++;
//       }
//     });

//     const testsWithStats = tests.map((test) => {
//       const stats = resultMap[test._id.toString()] || { success: 0, error: 0 };
//       return { ...test.toObject(), ...stats };
//     });

//     res.json(testsWithStats);
//   } catch (err) {
//     console.error("Помилка при отриманні тестів:", err);
//     res.status(500).json({ error: "Помилка сервера при отриманні тестів" });
//   }
// };

// Отримуємо тест за ID
exports.getTestById = async (req, res) => {
  try {
    const { id } = req.params;
    const test = await Test.findById(id);

    if (!test) {
      return res.status(404).json({ error: "Тест не знайдено" });
    }

     // Якщо тест згенерований, завантажуємо питання з окремої колекції
    if (test.isGenerated) {
      const questions = await TestQuestion.find({ test: id })
        .sort({ questionIndex: 1 })
        .select('questionData questionIndex');
      
      // Формуємо масив питань у форматі, який очікує frontend
      const generatedQuestions = questions.map(q => q.questionData);    
      
      return res.json({ 
        test: {
          ...test.toObject(),
          generatedQuestions
        }
      });
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
      // user: user.id,
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


// Генеруємо новий тест з динамічними питаннями
exports.generateTest = async (req, res) => {
  try {
    const QuestionGenerator = require('../utils/QuestionGenerator');
    const generator = new QuestionGenerator();
    
    // Отримуємо параметри з запиту (за замовчуванням)
    const { topicType = 'signs', questionCount = 20 } = req.body;
    
    // Валідація topicType
    const validTopicTypes = ['lights', 'signs'];
    const finalTopicType = validTopicTypes.includes(topicType) ? topicType : 'signs';
    
    // Валідація кількості питань (мінімум 1, максимум 20)
    const finalQuestionCount = Math.max(1, Math.min(20, parseInt(questionCount) || 5));
    
    // Генеруємо унікальний тип для тесту
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const testType = `generated_${timestamp}_${randomSuffix}`;
    
    // Генеруємо питання використовуючи клас
    const generatedQuestions = generator.generateQuestions(finalQuestionCount, finalTopicType);
    
    // Формуємо назву тесту
    const topicName = finalTopicType === 'lights' ? 'Світлофори' : 'Дорожні знаки';
    const testName = `Згенерований тест: ${topicName} (${new Date().toLocaleDateString('uk-UA')})`;

    // Створюємо новий тест
    const test = await Test.create({
      name: testName,
      type: testType,
      isGenerated: true
    });

    // Зберігаємо питання в окрему колекцію
    const questionsToSave = generatedQuestions.map((question, index) => ({
      test: test._id,
      questionIndex: index,
      questionData: question
    }));

    await TestQuestion.insertMany(questionsToSave);

    res.status(201).json({ 
      message: 'Тест успішно згенеровано',
      test,
      stats: {
        questionCount: generatedQuestions.length,
        topicType: finalTopicType
      }
    });
  } catch (err) {
    console.error('Помилка генерації тесту:', err);
    res.status(500).json({ error: 'Помилка при генерації тесту' });
  }
};

// Отримуємо всі згенеровані тести
exports.getGeneratedTests = async (req, res) => {
  try {
    const tests = await Test.find({ isGenerated: true });

    // Отримуємо статистику для згенерованих тестів
    const authHeader = req.headers.authorization;
    let userId = null;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id;
      } catch (err) {
        console.warn("JWT невірний або прострочений:", err.message);
      }
    }

    const results = userId
      ? await TestResult.find({ user: userId })
      : [];

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

    // Приєднуємо статистику до кожного тесту
    const testsWithStats = tests.map((test) => {
      const stats = resultMap[test._id.toString()] || { success: 0, error: 0 };
      return { ...test.toObject(), ...stats };
    });

    res.json(testsWithStats);
  } catch (err) {
    console.error("Помилка при отриманні згенерованих тестів:", err);
    res.status(500).json({ error: "Помилка сервера при отриманні згенерованих тестів" });
  }
};

// Видаляємо тест (разом із згенерованими питаннями та результатами)
exports.deleteTest = async (req, res) => {
  try {
    const { id } = req.params;

    const test = await Test.findById(id);
    if (!test) {
      return res.status(404).json({ error: "Тест не знайдено" });
    }

    // Видаляємо всі результати, пов'язані з цим тестом
    await TestResult.deleteMany({ topic: id });

    // Якщо тест згенерований — видаляємо також усі його питання
    if (test.isGenerated) {
      await TestQuestion.deleteMany({ test: id });
    }

    await test.deleteOne();

    return res.status(200).json({ message: "Тест успішно видалено" });
  } catch (err) {
    console.error("Помилка при видаленні тесту:", err);
    res.status(500).json({ error: "Помилка при видаленні тесту" });
  }
};
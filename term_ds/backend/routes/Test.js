const express = require('express');
const router = express.Router();
const TestController = require('../controllers/TestController');

// Маршрути HTTP для роботи з тестами та результатами тестування користувача
router.get('/', TestController.getAllTests);
router.get('/:id', TestController.getTestById);
router.delete('/:id', TestController.deleteTest);

router.post('/result', TestController.saveTestResult);
router.get('/results/user', TestController.getUserResults);

router.get('/generated', TestController.getGeneratedTests);
router.post('/generate', TestController.generateTest);

module.exports = router;


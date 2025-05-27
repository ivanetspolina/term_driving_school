const express = require('express');
const router = express.Router();
const TestController = require('../controllers/TestController');

router.get('/', TestController.getAllTests);
router.get('/:id', TestController.getTestById);
router.post('/result', TestController.saveTestResult);
router.get('/results/user', TestController.getUserResults);

module.exports = router;


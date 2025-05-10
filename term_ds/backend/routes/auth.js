const express = require('express');
const router = express.Router();
const { login, register, auth } = require('../controllers/AuthController');

router.post('/', auth);
router.post('/register', register);
router.post('/login', login);

module.exports = router;

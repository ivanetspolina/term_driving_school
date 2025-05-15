const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

router.post('/', AuthController.auth);
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/profile', AuthController.getProfile);
router.patch('/change_password', AuthController.changePassword);
router.post('/activate', AuthController.activateAccount);
router.post('/resend_activation', AuthController.resendActivateAccount);
router.patch('/update_profile', AuthController.updateProfile);
router.delete('/delete', AuthController.deleteAccount);

module.exports = router;

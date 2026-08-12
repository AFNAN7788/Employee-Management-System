const express = require('express');
const router = express.Router();
const { register, login, getMe, updateProfile } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validateMiddleware');

const registerRules = {
  name: { required: true, label: 'Name', minLength: 2 },
  email: { required: true, label: 'Email', isEmail: true },
  password: { required: true, label: 'Password', isStrongPassword: true },
  confirm_password: { required: true, label: 'Confirm password', matches: 'password' },
};

const loginRules = {
  email: { required: true, label: 'Email', isEmail: true },
  password: { required: true, label: 'Password' },
};

router.post('/register', validate(registerRules), register);
router.post('/login', validate(loginRules), login);
router.get('/me', authMiddleware, getMe);
router.put('/profile', authMiddleware, updateProfile);

module.exports = router;

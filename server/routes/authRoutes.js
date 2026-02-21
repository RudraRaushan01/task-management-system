const express = require('express');
const asyncHandler = require('express-async-handler');
const {
  registerValidation,
  loginValidation,
  register,
  login,
  getMe,
} = require('../controllers/authController');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerValidation, validate, asyncHandler(register));
router.post('/login', loginValidation, validate, asyncHandler(login));
router.get('/me', protect, asyncHandler(getMe));

module.exports = router;

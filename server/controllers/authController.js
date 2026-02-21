const { body } = require('express-validator');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const registerValidation = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

const register = async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: 'Email is already in use' });
  }

  const user = await User.create({ name, email, password });
  const token = generateToken({ id: user._id, name: user.name, email: user.email });

  return res.status(201).json({
    message: 'Registration successful',
    token,
    user: { id: user._id, name: user.name, email: user.email },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = generateToken({ id: user._id, name: user.name, email: user.email });

  return res.status(200).json({
    message: 'Login successful',
    token,
    user: { id: user._id, name: user.name, email: user.email },
  });
};

const getMe = async (req, res) => {
  return res.status(200).json({ user: req.user });
};

module.exports = {
  registerValidation,
  loginValidation,
  register,
  login,
  getMe,
};

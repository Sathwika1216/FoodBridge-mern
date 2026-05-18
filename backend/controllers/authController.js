const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  organizationName: user.organizationName,
  location: user.location,
  phone: user.phone,
  isVerified: user.isVerified,
  foodSavedCount: user.foodSavedCount,
});

// @route   POST /api/register
const register = async (req, res) => {
  const { name, email, password, role, organizationName, location, phone } =
    req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  if (!['donor', 'ngo'].includes(role)) {
    return res.status(400).json({ message: 'Invalid registration role' });
  }

  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(400).json({ message: 'User already exists with this email' });
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
    organizationName: organizationName || '',
    location: location || '',
    phone: phone || '',
    isVerified: role === 'donor',
  });

  res.status(201).json({
    ...sanitizeUser(user),
    token: generateToken(user._id),
  });
};

// @route   POST /api/login
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  res.json({
    ...sanitizeUser(user),
    token: generateToken(user._id),
  });
};

// @route   GET /api/me
const getMe = async (req, res) => {
  res.json(sanitizeUser(req.user));
};

module.exports = { register, login, getMe };

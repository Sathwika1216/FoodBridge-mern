require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const email = process.env.ADMIN_EMAIL || 'admin@foodbridge.com';
  const exists = await User.findOne({ email });
  if (exists) {
    console.log('Admin already exists');
    process.exit(0);
  }
  await User.create({
    name: 'FoodBridge Admin',
    email,
    password: process.env.ADMIN_PASSWORD || 'admin123456',
    role: 'admin',
    isVerified: true,
  });
  console.log('Admin user created:', email);
  process.exit(0);
};

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});

const User = require('../models/User');
const FoodListing = require('../models/FoodListing');
const Reservation = require('../models/Reservation');

// @route   GET /api/users
const getUsers = async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json(users);
};

// @route   PUT /api/verify-user/:id
const verifyUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (user.role !== 'ngo') {
    return res.status(400).json({ message: 'Only NGO accounts can be verified' });
  }

  user.isVerified = true;
  await user.save();

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isVerified: user.isVerified,
  });
};

// @route   DELETE /api/listing/:id
const deleteListing = async (req, res) => {
  const food = await FoodListing.findById(req.params.id);

  if (!food) {
    return res.status(404).json({ message: 'Listing not found' });
  }

  food.status = 'removed';
  food.isAvailable = false;
  await food.save();

  res.json({ message: 'Listing removed by admin' });
};

// @route   GET /api/admin/analytics
const getAnalytics = async (req, res) => {
  const [users, foods, reservations] = await Promise.all([
    User.countDocuments(),
    FoodListing.countDocuments({ status: { $ne: 'removed' } }),
    Reservation.countDocuments(),
  ]);

  const ngos = await User.countDocuments({ role: 'ngo' });
  const donors = await User.countDocuments({ role: 'donor' });
  const verifiedNgos = await User.countDocuments({ role: 'ngo', isVerified: true });
  const reserved = await FoodListing.countDocuments({ status: 'reserved' });
  const pickedUp = await FoodListing.countDocuments({ status: 'picked_up' });

  const allFoods = await FoodListing.find({ status: { $ne: 'removed' } });
  const totalQuantity = allFoods.reduce((s, f) => s + f.quantity, 0);

  res.json({
    totalUsers: users,
    totalDonors: donors,
    totalNgos: ngos,
    verifiedNgos,
    totalListings: foods,
    totalReservations: reservations,
    reservedListings: reserved,
    pickedUpListings: pickedUp,
    totalFoodSaved: totalQuantity,
    wasteReducedKg: Math.round(totalQuantity * 0.5),
  });
};

module.exports = { getUsers, verifyUser, deleteListing, getAnalytics };

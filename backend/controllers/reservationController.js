const Reservation = require('../models/Reservation');
const FoodListing = require('../models/FoodListing');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { getUrgencyLevel } = require('../utils/expiry');

// @route   POST /api/reserve
const createReservation = async (req, res) => {
  const { foodId, pickupNotes } = req.body;

  if (!foodId) {
    return res.status(400).json({ message: 'Food listing ID is required' });
  }

  if (!req.user.isVerified) {
    return res
      .status(403)
      .json({ message: 'Your NGO account must be verified before reserving food' });
  }

  const food = await FoodListing.findById(foodId);

  if (!food || food.status !== 'available' || !food.isAvailable) {
    return res.status(400).json({ message: 'This food item is not available' });
  }

  const { level } = getUrgencyLevel(food.expiryDate);
  if (level === 'expired') {
    return res.status(400).json({ message: 'Cannot reserve expired food' });
  }

  const existing = await Reservation.findOne({
    foodListing: foodId,
    status: { $in: ['pending', 'approved'] },
  });

  if (existing) {
    return res.status(400).json({ message: 'This item is already reserved' });
  }

  const reservation = await Reservation.create({
    foodListing: foodId,
    ngo: req.user._id,
    donor: food.donor,
    pickupNotes: pickupNotes || '',
    status: 'pending',
  });

  food.status = 'reserved';
  food.isAvailable = false;
  await food.save();

  await Notification.create({
    user: food.donor,
    title: 'Reservation request',
    message: `${req.user.organizationName || req.user.name} requested to reserve ${food.foodName}.`,
    type: 'reservation',
    relatedId: reservation._id,
  });

  await Notification.create({
    user: req.user._id,
    title: 'Reservation submitted',
    message: `Your reservation for ${food.foodName} is pending donor approval.`,
    type: 'reservation',
    relatedId: reservation._id,
  });

  const populated = await Reservation.findById(reservation._id)
    .populate('foodListing')
    .populate('ngo', 'name organizationName phone location')
    .populate('donor', 'name organizationName phone');

  res.status(201).json(populated);
};

// @route   GET /api/reservations
const getReservations = async (req, res) => {
  const filter = {};

  if (req.user.role === 'ngo') filter.ngo = req.user._id;
  if (req.user.role === 'donor') filter.donor = req.user._id;

  const reservations = await Reservation.find(filter)
    .populate({
      path: 'foodListing',
      populate: { path: 'donor', select: 'name organizationName phone' },
    })
    .populate('ngo', 'name organizationName phone location email')
    .populate('donor', 'name organizationName phone')
    .sort({ createdAt: -1 });

  res.json(reservations);
};

// @route   PUT /api/approve/:id
const approveReservation = async (req, res) => {
  const reservation = await Reservation.findById(req.params.id);

  if (!reservation) {
    return res.status(404).json({ message: 'Reservation not found' });
  }

  if (
    reservation.donor.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    return res.status(403).json({ message: 'Not authorized to approve this reservation' });
  }

  reservation.status = 'approved';
  await reservation.save();

  const food = await FoodListing.findById(reservation.foodListing);
  if (food) {
    food.status = 'reserved';
    await food.save();
  }

  await Notification.create({
    user: reservation.ngo,
    title: 'Reservation approved',
    message: `Your reservation for ${food?.foodName || 'food'} has been approved. Pick up soon!`,
    type: 'reservation',
    relatedId: reservation._id,
  });

  const populated = await Reservation.findById(reservation._id)
    .populate('foodListing')
    .populate('ngo', 'name organizationName phone location')
    .populate('donor', 'name organizationName phone');

  res.json(populated);
};

// @route   PUT /api/reservations/:id/complete
const completeReservation = async (req, res) => {
  const reservation = await Reservation.findById(req.params.id);

  if (!reservation) {
    return res.status(404).json({ message: 'Reservation not found' });
  }

  const canComplete =
    req.user.role === 'admin' ||
    reservation.donor.toString() === req.user._id.toString() ||
    reservation.ngo.toString() === req.user._id.toString();

  if (!canComplete) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  reservation.status = 'completed';
  await reservation.save();

  const food = await FoodListing.findById(reservation.foodListing);
  if (food) {
    food.status = 'picked_up';
    food.isAvailable = false;
    await food.save();

    await User.findByIdAndUpdate(food.donor, {
      $inc: { foodSavedCount: food.quantity },
    });
    await User.findByIdAndUpdate(reservation.ngo, {
      $inc: { foodSavedCount: food.quantity },
    });
  }

  res.json(
    await Reservation.findById(reservation._id)
      .populate('foodListing')
      .populate('ngo', 'name organizationName')
      .populate('donor', 'name organizationName')
  );
};

module.exports = {
  createReservation,
  getReservations,
  approveReservation,
  completeReservation,
};

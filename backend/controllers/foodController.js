const FoodListing = require('../models/FoodListing');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { getUrgencyLevel } = require('../utils/expiry');

const applyUrgency = (listing) => {
  const { level } = getUrgencyLevel(listing.expiryDate);
  listing.urgencyLevel = level;
  return listing;
};

const isFutureOrToday = (date) => {
  const d = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  return d >= today;
};

// @route   POST /api/foods
const createFood = async (req, res) => {
  const {
    foodName,
    category,
    quantity,
    unit,
    expiryDate,
    pickupLocation,
    storeName,
    contactPhone,
    imageUrl,
    description,
    isAvailable,
  } = req.body;

  if (
    !foodName ||
    !category ||
    !quantity ||
    !expiryDate ||
    !pickupLocation ||
    !storeName ||
    !contactPhone
  ) {
    return res.status(400).json({ message: 'Please fill all required fields' });
  }

  if (!isFutureOrToday(expiryDate)) {
    return res
      .status(400)
      .json({ message: 'Only non-expired food can be listed for donation' });
  }

  const { level } = getUrgencyLevel(expiryDate);

  const food = await FoodListing.create({
    donor: req.user._id,
    foodName,
    category,
    quantity,
    unit: unit || 'items',
    expiryDate,
    pickupLocation,
    storeName,
    contactPhone,
    imageUrl: imageUrl || '',
    description:
      description ||
      'Sealed/unopened packaged or safe raw food only. No opened, homemade, or cooked leftovers.',
    isAvailable: isAvailable !== false,
    urgencyLevel: level,
    status: 'available',
  });

  const ngos = await User.find({
    role: 'ngo',
    isVerified: true,
    location: { $regex: pickupLocation.split(',')[0] || pickupLocation, $options: 'i' },
  }).limit(20);

  if (ngos.length) {
    await Notification.insertMany(
      ngos.map((ngo) => ({
        user: ngo._id,
        title: 'New food donation nearby',
        message: `${storeName} listed ${foodName} for pickup at ${pickupLocation}.`,
        type: 'food',
        relatedId: food._id,
      }))
    );
  }

  res.status(201).json(food);
};

// @route   GET /api/foods
const getFoods = async (req, res) => {
  const { category, location, urgency, status, search, donorId } = req.query;
  const filter = { status: { $ne: 'removed' } };

  if (category) filter.category = category;
  if (location) filter.pickupLocation = { $regex: location, $options: 'i' };
  if (urgency) filter.urgencyLevel = urgency;
  if (status) filter.status = status;
  if (donorId) filter.donor = donorId;
  if (search) {
    filter.$or = [
      { foodName: { $regex: search, $options: 'i' } },
      { storeName: { $regex: search, $options: 'i' } },
    ];
  }

  if (req.user?.role === 'ngo') {
    filter.status = 'available';
    filter.isAvailable = true;
  }

  let foods = await FoodListing.find(filter)
    .populate('donor', 'name organizationName location phone')
    .sort({ expiryDate: 1 });

  foods = foods.map((f) => {
    const doc = f.toObject();
    const { level } = getUrgencyLevel(doc.expiryDate);
    doc.urgencyLevel = level;
    if (level === 'expired') doc.status = 'removed';
    return doc;
  });

  if (urgency) {
    foods = foods.filter((f) => f.urgencyLevel === urgency);
  }

  foods = foods.filter((f) => f.urgencyLevel !== 'expired');

  res.json(foods);
};

// @route   GET /api/foods/:id
const getFoodById = async (req, res) => {
  const food = await FoodListing.findById(req.params.id).populate(
    'donor',
    'name organizationName location phone email'
  );

  if (!food || food.status === 'removed') {
    return res.status(404).json({ message: 'Food listing not found' });
  }

  const doc = food.toObject();
  doc.urgencyLevel = getUrgencyLevel(doc.expiryDate).level;
  res.json(doc);
};

// @route   PUT /api/foods/:id
const updateFood = async (req, res) => {
  let food = await FoodListing.findById(req.params.id);

  if (!food) {
    return res.status(404).json({ message: 'Food listing not found' });
  }

  if (
    food.donor.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    return res.status(403).json({ message: 'Not authorized to update this listing' });
  }

  if (req.body.expiryDate && !isFutureOrToday(req.body.expiryDate)) {
    return res.status(400).json({ message: 'Expiry date must be today or in the future' });
  }

  const updates = { ...req.body };
  if (updates.expiryDate) {
    updates.urgencyLevel = getUrgencyLevel(updates.expiryDate).level;
  }

  food = await FoodListing.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  res.json(applyUrgency(food));
};

// @route   DELETE /api/foods/:id
const deleteFood = async (req, res) => {
  const food = await FoodListing.findById(req.params.id);

  if (!food) {
    return res.status(404).json({ message: 'Food listing not found' });
  }

  if (
    food.donor.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    return res.status(403).json({ message: 'Not authorized to delete this listing' });
  }

  food.status = 'removed';
  food.isAvailable = false;
  await food.save();

  res.json({ message: 'Listing removed successfully' });
};

// @route   GET /api/foods/stats/summary
const getFoodStats = async (req, res) => {
  const match =
    req.user.role === 'donor'
      ? { donor: req.user._id, status: { $ne: 'removed' } }
      : { status: { $ne: 'removed' } };

  const listings = await FoodListing.find(match);
  const totalDonations = listings.length;
  const available = listings.filter((l) => l.status === 'available').length;
  const reserved = listings.filter((l) => l.status === 'reserved').length;
  const pickedUp = listings.filter((l) => l.status === 'picked_up').length;
  const totalQuantity = listings.reduce((sum, l) => sum + l.quantity, 0);

  res.json({
    totalDonations,
    available,
    reserved,
    pickedUp,
    totalFoodSaved: totalQuantity,
    wasteReducedKg: Math.round(totalQuantity * 0.5),
  });
};

module.exports = {
  createFood,
  getFoods,
  getFoodById,
  updateFood,
  deleteFood,
  getFoodStats,
};

const mongoose = require('mongoose');

const foodListingSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    foodName: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: [
        'packaged',
        'dairy',
        'bakery',
        'produce',
        'beverages',
        'frozen',
        'other',
      ],
    },
    quantity: { type: Number, required: true, min: 1 },
    unit: { type: String, default: 'items', trim: true },
    expiryDate: { type: Date, required: true },
    pickupLocation: { type: String, required: true, trim: true },
    storeName: { type: String, required: true, trim: true },
    contactPhone: { type: String, required: true, trim: true },
    imageUrl: { type: String, default: '' },
    description: {
      type: String,
      default: 'Sealed/unopened packaged or safe raw food only.',
      trim: true,
    },
    status: {
      type: String,
      enum: ['available', 'reserved', 'picked_up', 'removed'],
      default: 'available',
    },
    urgencyLevel: {
      type: String,
      enum: ['safe', 'near', 'urgent', 'expired'],
      default: 'safe',
    },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

foodListingSchema.index({ category: 1, pickupLocation: 1, expiryDate: 1 });

module.exports = mongoose.model('FoodListing', foodListingSchema);

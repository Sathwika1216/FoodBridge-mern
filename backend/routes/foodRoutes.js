const express = require('express');
const {
  createFood,
  getFoods,
  getFoodById,
  updateFood,
  deleteFood,
  getFoodStats,
} = require('../controllers/foodController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/stats/summary', protect, getFoodStats);
router.get('/', protect, getFoods);
router.get('/:id', protect, getFoodById);
router.post('/', protect, authorize('donor', 'admin'), createFood);
router.put('/:id', protect, authorize('donor', 'admin'), updateFood);
router.delete('/:id', protect, authorize('donor', 'admin'), deleteFood);

module.exports = router;

const express = require('express');
const {
  createReservation,
  getReservations,
  approveReservation,
  completeReservation,
} = require('../controllers/reservationController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/reserve', protect, authorize('ngo'), createReservation);
router.get('/reservations', protect, getReservations);
router.put('/approve/:id', protect, authorize('donor', 'admin'), approveReservation);
router.put(
  '/reservations/:id/complete',
  protect,
  authorize('donor', 'ngo', 'admin'),
  completeReservation
);

module.exports = router;

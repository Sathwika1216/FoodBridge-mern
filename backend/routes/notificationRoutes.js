const express = require('express');
const {
  getNotifications,
  markAsRead,
  markAllRead,
} = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/notifications', protect, getNotifications);
router.put('/notifications/read-all', protect, markAllRead);
router.put('/notifications/:id/read', protect, markAsRead);

module.exports = router;

const express = require('express');
const {
  getUsers,
  verifyUser,
  deleteListing,
  getAnalytics,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/users', getUsers);
router.get('/admin/analytics', getAnalytics);
router.put('/verify-user/:id', verifyUser);
router.delete('/listing/:id', deleteListing);

module.exports = router;

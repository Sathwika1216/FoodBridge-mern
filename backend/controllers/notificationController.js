const Notification = require('../models/Notification');

// @route   GET /api/notifications
const getNotifications = async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort({
    createdAt: -1,
  });

  res.json(notifications);
};

// @route   PUT /api/notifications/:id/read
const markAsRead = async (req, res) => {
  const notification = await Notification.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!notification) {
    return res.status(404).json({ message: 'Notification not found' });
  }

  notification.read = true;
  await notification.save();
  res.json(notification);
};

// @route   PUT /api/notifications/read-all
const markAllRead = async (req, res) => {
  await Notification.updateMany({ user: req.user._id }, { read: true });
  res.json({ message: 'All notifications marked as read' });
};

module.exports = { getNotifications, markAsRead, markAllRead };

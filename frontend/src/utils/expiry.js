export const getUrgencyMeta = (expiryDate) => {
  const expiry = new Date(expiryDate);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  expiry.setHours(0, 0, 0, 0);
  const daysLeft = Math.ceil((expiry - now) / (24 * 60 * 60 * 1000));

  if (daysLeft < 0) return { level: 'expired', label: 'Expired', daysLeft };
  if (daysLeft <= 2) return { level: 'urgent', label: 'Urgent Pickup', daysLeft };
  if (daysLeft <= 5) return { level: 'near', label: 'Near Expiry', daysLeft };
  return { level: 'safe', label: 'Safe', daysLeft };
};

export const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

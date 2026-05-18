import { getUrgencyMeta } from '../utils/expiry';

const UrgencyBadge = ({ expiryDate, level }) => {
  const meta = level ? { level, label: level } : getUrgencyMeta(expiryDate);
  const labels = {
    safe: 'Safe',
    near: 'Near Expiry',
    urgent: 'Urgent Pickup',
    expired: 'Expired',
  };

  return (
    <span className={`urgency-badge urgency-${meta.level}`}>
      {labels[meta.level] || meta.label}
    </span>
  );
};

export default UrgencyBadge;

const EmptyState = ({ icon = '📭', title, message, action }) => (
  <div className="empty-state">
    <span className="empty-icon">{icon}</span>
    <h3>{title}</h3>
    <p>{message}</p>
    {action}
  </div>
);

export default EmptyState;

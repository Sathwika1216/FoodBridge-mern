const StatCard = ({ icon, label, value, accent }) => (
  <div className={`stat-card ${accent || ''}`}>
    <span className="stat-icon">{icon}</span>
    <p className="stat-label">{label}</p>
    <h3 className="stat-value">{value}</h3>
  </div>
);

export default StatCard;

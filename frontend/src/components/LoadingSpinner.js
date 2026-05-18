const LoadingSpinner = ({ size = 'md', label = 'Loading...' }) => (
  <div className={`spinner-wrap spinner-${size}`} role="status">
    <div className="spinner" />
    {label && <p className="spinner-label">{label}</p>}
  </div>
);

export default LoadingSpinner;
